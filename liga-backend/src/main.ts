import express from "express";
import dotenv from "dotenv";
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
import { verifyToken, hasRole } from "./infrastructure/middlewares/auth.middleware";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use((req, res, next) => {
  // console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url} - Origin: ${req.headers.origin}`);
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

// Helpers for role-based protection
const adminOnly = [verifyToken, hasRole(["SUPERADMIN"])];
const vocalOrAdmin = [verifyToken, hasRole(["VOCAL", "SUPERADMIN"])];

// Routes using functional handlers (Cluster Pattern)
const router = express.Router();

// Auth Routes
router.post("/auth/login", AuthHandlers.login);
router.post("/auth/register", AuthHandlers.register);

// Team Routes (GET Public, others Admin)
router.get("/teams", TeamHandlers.getAllTeams);
router.get("/teams/:id", TeamHandlers.getTeam);
router.post("/teams", ...adminOnly, TeamHandlers.createTeam);
router.put("/teams/:id", ...adminOnly, TeamHandlers.updateTeam);
router.delete("/teams/:id", ...adminOnly, TeamHandlers.deleteTeam);

// Player Routes (GET Public, others Admin)
router.get("/players", PlayerHandlers.getAllPlayers);
router.get("/players/team/:teamId", PlayerHandlers.getPlayersByTeam);
router.get("/players/:id", PlayerHandlers.getPlayer);
router.post("/players", ...adminOnly, PlayerHandlers.createPlayer);
router.put("/players/:id", ...adminOnly, PlayerHandlers.updatePlayer);
router.delete("/players/:id", ...adminOnly, PlayerHandlers.deletePlayer);

// Match Routes (GET Public, Modify Vocal/Admin)
router.get("/matches", MatchHandlers.getAllMatches);
router.get("/matches/:id", MatchHandlers.getMatch);
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

// Stats Routes (Public)
router.get("/stats/top-scorers/:tournamentId", MatchEventHandlers.getTopScorers);
router.get("/stats/standings/:tournamentId", TeamHandlers.getStandings);

router.get("/", (_req, res) => {
  res.json({ message: "Liga API is running" });
});

app.use("/api", router);

app.listen(Number(port), "0.0.0.0", () => {
  console.log(`Server running at http://localhost:${port}`);
});
