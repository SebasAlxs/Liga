import express from "express";
import dotenv from "dotenv";
import compression from "compression";
import { TeamHandlers } from "./infrastructure/handlers/Team/src";
import { PlayerHandlers } from "./infrastructure/handlers/Player/src";
import { MatchHandlers } from "./infrastructure/handlers/Match/src";
import { TournamentHandlers } from "./infrastructure/handlers/Tournament/src";
import { CategoryHandlers } from "./infrastructure/handlers/Category/src";
import { HeadquartersHandlers } from "./infrastructure/handlers/Headquarters/src";
import { MatchEventHandlers } from "./infrastructure/handlers/MatchEvent/src";
import { SuspensionHandlers } from "./infrastructure/handlers/Suspension/src";
import { AuthHandlers } from "./infrastructure/handlers/Auth/src";
import { MatchLineupHandlers } from "./infrastructure/handlers/MatchLineup/src";
import { RefereeHandlers } from "./infrastructure/handlers/Referee/src";
import { UserHandlers } from "./infrastructure/handlers/User/src";
import { ModuleAccessHandlers } from "./infrastructure/handlers/ModuleAccess/src";
import { LeagueRulesHandlers } from "./infrastructure/handlers/LeagueRules/src";
import { RuleItemHandlers } from "./infrastructure/handlers/RuleItem/src";
import { StageHandlers } from "./infrastructure/handlers/Stage/src";
import { verifyToken, hasRole, optionalAuth } from "./infrastructure/middlewares/auth.middleware";
import { globalErrorHandler } from "./infrastructure/middlewares/error.middleware";
import { validateRequest } from "./infrastructure/middlewares/validate.middleware";
import { AuthValidator } from "./adapters/http/validators/AuthValidator";
import { UserValidator } from "./adapters/http/validators/UserValidator";
import { TeamValidator } from "./adapters/http/validators/TeamValidator";
import { PlayerValidator } from "./adapters/http/validators/PlayerValidator";

import { logger } from "./infrastructure/libs/logger";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url} - Origin: ${req.headers.origin || "Unknown"}`);
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(compression());

// Helpers for role-based protection
const adminOnly = [verifyToken, hasRole(["SUPERADMIN", "ADMIN"])];
const superAdminOnly = [verifyToken, hasRole(["SUPERADMIN"])];
const teamManagers = [verifyToken, hasRole(["SUPERADMIN", "ADMIN", "DIRIGENTE"])];
const superAdminAndDirigente = [verifyToken, hasRole(["SUPERADMIN", "DIRIGENTE"])];
const vocalOrAdmin = [verifyToken, hasRole(["VOCAL", "SUPERADMIN", "ADMIN"])];

// Routes using functional handlers (Cluster Pattern)
const router = express.Router();

// Auth Routes
router.post("/auth/login", validateRequest(AuthValidator.login), AuthHandlers.login);

// User Management Routes (SUPERADMIN only)
router.get("/users", ...superAdminOnly, UserHandlers.getAllUsers);
router.post("/users", ...superAdminOnly, validateRequest(UserValidator.create), UserHandlers.createUser);
router.put("/users/:id", ...superAdminOnly, validateRequest(UserValidator.update), UserHandlers.updateUser);
router.delete("/users/:id", ...superAdminOnly, UserHandlers.deleteUser);

// League Rules Routes (reglas globales del campeonato: GET público, editar solo Admin)
router.get("/league-rules", LeagueRulesHandlers.getLeagueRules);
router.put("/league-rules", ...adminOnly, LeagueRulesHandlers.updateLeagueRules);

// League Rule Items (lista libre de reglas: GET público, CRUD solo Admin)
router.get("/league-rule-items/tournament/:tournamentId", RuleItemHandlers.getTournamentRuleItems);
router.post("/league-rule-items", ...adminOnly, RuleItemHandlers.createRuleItem);
router.put("/league-rule-items/:id", ...adminOnly, RuleItemHandlers.updateRuleItem);
router.delete("/league-rule-items/:id", ...adminOnly, RuleItemHandlers.deleteRuleItem);

// Stage Routes
router.get("/stages/tournament/:tournamentId", StageHandlers.getTournamentStages);
router.post("/stages", ...adminOnly, StageHandlers.createStage);
router.put("/stages/:id", ...adminOnly, StageHandlers.updateStage);
router.delete("/stages/:id", ...adminOnly, StageHandlers.deleteStage);

// Module Access Routes (qué módulos ve cada rol en el menú)
router.get("/module-access/me", verifyToken, ModuleAccessHandlers.getMyModules);
router.get("/module-access", ...superAdminOnly, ModuleAccessHandlers.getAllModuleAccess);
router.put("/module-access", ...superAdminOnly, ModuleAccessHandlers.updateModuleAccess);

// Team Routes (GET Public, Create/Edit: SuperAdmin/Dirigente, Delete: SuperAdmin)
router.get("/teams", optionalAuth, TeamHandlers.getAllTeams);
router.get("/teams/:id", TeamHandlers.getTeam);
router.post("/teams", ...superAdminAndDirigente, validateRequest(TeamValidator.create), TeamHandlers.createTeam);
router.put("/teams/:id", ...superAdminAndDirigente, validateRequest(TeamValidator.update), TeamHandlers.updateTeam);
router.delete("/teams/:id", ...superAdminOnly, TeamHandlers.deleteTeam);

// Player Routes (GET Public, Create/Edit: Admin/Dirigente, Delete: Admin)
router.get("/players", optionalAuth, PlayerHandlers.getAllPlayers);
router.get("/players/team/:teamId", PlayerHandlers.getPlayersByTeam);
router.get("/players/:id", PlayerHandlers.getPlayer);
router.get("/players/:id/team-history", PlayerHandlers.getPlayerTeamHistory);
router.get("/players/:id/matches", PlayerHandlers.getPlayerMatchHistory);
router.post("/players", ...teamManagers, validateRequest(PlayerValidator.create), PlayerHandlers.createPlayer);
router.put("/players/:id", ...teamManagers, validateRequest(PlayerValidator.update), PlayerHandlers.updatePlayer);
router.delete("/players/:id", ...adminOnly, PlayerHandlers.deletePlayer);

// Match Routes (GET Public, Modify Vocal/Admin)
router.get("/matches", optionalAuth, MatchHandlers.getAllMatches);
router.get("/matches/:id", MatchHandlers.getMatch);
router.get("/matches/:id/vocalia-sheet/pdf", ...vocalOrAdmin, MatchHandlers.getVocaliaSheetPdf);
router.get("/matches/fixture/pdf", MatchHandlers.getFixturePdf);
router.post("/matches/fixture/generate", ...adminOnly, MatchHandlers.generateFixture);
router.post("/matches", ...adminOnly, MatchHandlers.createMatch);
router.put("/matches/:id", ...vocalOrAdmin, MatchHandlers.updateMatch);
router.delete("/matches/:id", ...adminOnly, MatchHandlers.deleteMatch);

// Tournament Routes (GET Public, others Admin)
router.get("/tournaments", TournamentHandlers.getAllTournaments);
router.get("/tournaments/:id", TournamentHandlers.getTournament);
router.post("/tournaments", ...adminOnly, TournamentHandlers.createTournament);
router.put("/tournaments/:id", ...adminOnly, TournamentHandlers.updateTournament);
router.delete("/tournaments/:id", ...adminOnly, TournamentHandlers.deleteTournament);

// Category Routes (GET Public, others Admin)
router.get("/categories", CategoryHandlers.getAllCategories);
router.get("/categories/:id", CategoryHandlers.getCategory);
router.post("/categories", ...adminOnly, CategoryHandlers.createCategory);
router.put("/categories/:id", ...adminOnly, CategoryHandlers.updateCategory);
router.delete("/categories/:id", ...adminOnly, CategoryHandlers.deleteCategory);

// Headquarters Routes (GET Public, others Admin)
router.get("/headquarters", HeadquartersHandlers.getAllHeadquarters);
router.post("/headquarters", ...adminOnly, HeadquartersHandlers.createHeadquarters);
router.put("/headquarters/:id", ...adminOnly, HeadquartersHandlers.updateHeadquarters);
router.delete("/headquarters/:id", ...adminOnly, HeadquartersHandlers.deleteHeadquarters);

// Referee Routes (GET Public, others Admin)
router.get("/referees", RefereeHandlers.getAllReferees);
router.post("/referees", ...adminOnly, RefereeHandlers.createReferee);
router.put("/referees/:id", ...adminOnly, RefereeHandlers.updateReferee);
router.delete("/referees/:id", ...adminOnly, RefereeHandlers.deleteReferee);

// Match Events Routes (GET Public, Modify Vocal/Admin)
router.get("/match-events/:matchId", MatchEventHandlers.getMatchEvents);
router.post("/match-events", ...vocalOrAdmin, MatchEventHandlers.addMatchEvent);
router.delete("/match-events/:id", ...vocalOrAdmin, MatchEventHandlers.deleteMatchEvent);

// Match Lineup (GET Public, Modify Vocal/Admin)
router.post("/match-lineups", ...vocalOrAdmin, MatchLineupHandlers.addPlayerToLineup);
router.get("/match-lineups/:matchId", MatchLineupHandlers.getMatchLineup);
router.put("/match-lineups/:id", ...vocalOrAdmin, MatchLineupHandlers.updatePlayerLineup);
router.delete("/match-lineups/:id", ...vocalOrAdmin, MatchLineupHandlers.deletePlayerFromLineup);

// Suspensions Routes
router.get("/suspensions", SuspensionHandlers.getPlayerSuspensions);

// Fines Routes
import fineRoutes from "./infrastructure/http/routes/fineRoutes";
import fineTypeRoutes from "./infrastructure/http/routes/fineTypeRoutes";
router.use("/fines", optionalAuth, fineRoutes);
router.use("/fine-types", optionalAuth, fineTypeRoutes);

// Stats Routes (Public)
router.get("/stats/top-scorers/:tournamentId", MatchEventHandlers.getTopScorers);
router.get("/stats/standings/:tournamentId", TeamHandlers.getStandings);

router.get("/server-time", (_req, res) => {
  res.json({ now: new Date().toISOString() });
});

router.get("/", (_req, res) => {
  res.json({ message: "Liga API is running" });
});

app.use("/api", router);

app.use(globalErrorHandler);

app.listen(Number(port), "0.0.0.0", () => {
  logger.info(`Server running at http://localhost:${port}`);
});
