"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const src_1 = require("./infrastructure/handlers/Team/src");
const src_2 = require("./infrastructure/handlers/Player/src");
const src_3 = require("./infrastructure/handlers/Match/src");
const src_4 = require("./infrastructure/handlers/Tournament/src");
const src_5 = require("./infrastructure/handlers/Category/src");
const src_6 = require("./infrastructure/handlers/Headquarters/src");
const src_7 = require("./infrastructure/handlers/MatchEvent/src");
const src_8 = require("./infrastructure/handlers/Suspension/src");
const src_9 = require("./infrastructure/handlers/Auth/src");
const src_10 = require("./infrastructure/handlers/MatchLineup/src");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ limit: "10mb", extended: true }));
// Routes using functional handlers (Cluster Pattern)
const router = express_1.default.Router();
// Auth Routes
router.post("/auth/login", src_9.AuthHandlers.login);
router.post("/auth/register", src_9.AuthHandlers.register);
// Team Routes
router.get("/teams", src_1.TeamHandlers.getAllTeams);
router.get("/teams/:id", src_1.TeamHandlers.getTeam);
router.post("/teams", src_1.TeamHandlers.createTeam);
router.put("/teams/:id", src_1.TeamHandlers.updateTeam);
router.delete("/teams/:id", src_1.TeamHandlers.deleteTeam);
// Player Routes
router.get("/players", src_2.PlayerHandlers.getAllPlayers);
router.get("/players/team/:teamId", src_2.PlayerHandlers.getPlayersByTeam);
router.get("/players/:id", src_2.PlayerHandlers.getPlayer);
router.post("/players", src_2.PlayerHandlers.createPlayer);
router.put("/players/:id", src_2.PlayerHandlers.updatePlayer);
router.delete("/players/:id", src_2.PlayerHandlers.deletePlayer);
// Match Routes
router.get("/matches", src_3.MatchHandlers.getAllMatches);
router.get("/matches/:id", src_3.MatchHandlers.getMatch);
router.post("/matches", src_3.MatchHandlers.createMatch);
router.put("/matches/:id", src_3.MatchHandlers.updateMatch);
router.delete("/matches/:id", src_3.MatchHandlers.deleteMatch);
// Tournament Routes
router.get("/tournaments", src_4.TournamentHandlers.getAllTournaments);
router.get("/tournaments/:id", src_4.TournamentHandlers.getTournament);
router.post("/tournaments", src_4.TournamentHandlers.createTournament);
router.put("/tournaments/:id", src_4.TournamentHandlers.updateTournament);
router.delete("/tournaments/:id", src_4.TournamentHandlers.deleteTournament);
// Category Routes
router.get("/categories", src_5.CategoryHandlers.getAllCategories);
router.get("/categories/:id", src_5.CategoryHandlers.getCategory);
router.post("/categories", src_5.CategoryHandlers.createCategory);
router.put("/categories/:id", src_5.CategoryHandlers.updateCategory);
router.delete("/categories/:id", src_5.CategoryHandlers.deleteCategory);
// Headquarters Routes
router.get("/headquarters", src_6.HeadquartersHandlers.getAllHeadquarters);
router.post("/headquarters", src_6.HeadquartersHandlers.createHeadquarters);
router.put("/headquarters/:id", src_6.HeadquartersHandlers.updateHeadquarters);
router.delete("/headquarters/:id", src_6.HeadquartersHandlers.deleteHeadquarters);
// Match Events Routes
router.get("/match-events/:matchId", src_7.MatchEventHandlers.getMatchEvents);
router.post("/match-events", src_7.MatchEventHandlers.addMatchEvent);
router.delete("/match-events/:id", src_7.MatchEventHandlers.deleteMatchEvent);
// Match Lineup
router.post("/match-lineups", src_10.MatchLineupHandlers.addPlayerToLineup);
router.get("/match-lineups/:matchId", src_10.MatchLineupHandlers.getMatchLineup);
router.put("/match-lineups/:id", src_10.MatchLineupHandlers.updatePlayerLineup);
router.delete("/match-lineups/:id", src_10.MatchLineupHandlers.deletePlayerFromLineup);
// Suspensions Routes
router.get("/suspensions", src_8.SuspensionHandlers.getPlayerSuspensions);
// Stats Routes
router.get("/stats/top-scorers/:tournamentId", src_7.MatchEventHandlers.getTopScorers);
router.get("/stats/standings/:tournamentId", src_1.TeamHandlers.getStandings);
app.use("/api", router);
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
