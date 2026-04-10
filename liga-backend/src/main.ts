import express from "express";
import dotenv from "dotenv";
import cors from "cors";
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

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Routes using functional handlers (Cluster Pattern)
const router = express.Router();

// Auth Routes
router.post("/auth/login", AuthHandlers.login);
router.post("/auth/register", AuthHandlers.register);

// Team Routes
router.get("/teams", TeamHandlers.getAllTeams);
router.get("/teams/:id", TeamHandlers.getTeam);
router.post("/teams", TeamHandlers.createTeam);
router.put("/teams/:id", TeamHandlers.updateTeam);
router.delete("/teams/:id", TeamHandlers.deleteTeam);

// Player Routes
router.get("/players", PlayerHandlers.getAllPlayers);
router.get("/players/team/:teamId", PlayerHandlers.getPlayersByTeam);
router.get("/players/:id", PlayerHandlers.getPlayer);
router.post("/players", PlayerHandlers.createPlayer);
router.put("/players/:id", PlayerHandlers.updatePlayer);
router.delete("/players/:id", PlayerHandlers.deletePlayer);

// Match Routes
router.get("/matches", MatchHandlers.getAllMatches);
router.get("/matches/:id", MatchHandlers.getMatch);
router.post("/matches", MatchHandlers.createMatch);
router.put("/matches/:id", MatchHandlers.updateMatch);
router.delete("/matches/:id", MatchHandlers.deleteMatch);

// Tournament Routes
router.get("/tournaments", TournamentHandlers.getAllTournaments);
router.get("/tournaments/:id", TournamentHandlers.getTournament);
router.post("/tournaments", TournamentHandlers.createTournament);
router.put("/tournaments/:id", TournamentHandlers.updateTournament);
router.delete("/tournaments/:id", TournamentHandlers.deleteTournament);

// Category Routes
router.get("/categories", CategoryHandlers.getAllCategories);
router.get("/categories/:id", CategoryHandlers.getCategory);
router.post("/categories", CategoryHandlers.createCategory);
router.put("/categories/:id", CategoryHandlers.updateCategory);
router.delete("/categories/:id", CategoryHandlers.deleteCategory);

// Headquarters Routes
router.get("/headquarters", HeadquartersHandlers.getAllHeadquarters);
router.post("/headquarters", HeadquartersHandlers.createHeadquarters);
router.put("/headquarters/:id", HeadquartersHandlers.updateHeadquarters);
router.delete("/headquarters/:id", HeadquartersHandlers.deleteHeadquarters);

// Referee Routes
router.get("/referees", RefereeHandlers.getAllReferees);
router.post("/referees", RefereeHandlers.createReferee);
router.put("/referees/:id", RefereeHandlers.updateReferee);
router.delete("/referees/:id", RefereeHandlers.deleteReferee);

// Match Events Routes
router.get("/match-events/:matchId", MatchEventHandlers.getMatchEvents);
router.post("/match-events", MatchEventHandlers.addMatchEvent);
router.delete("/match-events/:id", MatchEventHandlers.deleteMatchEvent);

// Match Lineup
router.post("/match-lineups", MatchLineupHandlers.addPlayerToLineup);
router.get("/match-lineups/:matchId", MatchLineupHandlers.getMatchLineup);
router.put("/match-lineups/:id", MatchLineupHandlers.updatePlayerLineup);
router.delete("/match-lineups/:id", MatchLineupHandlers.deletePlayerFromLineup);

// Suspensions Routes
router.get("/suspensions", SuspensionHandlers.getPlayerSuspensions);

// Stats Routes
router.get(
  "/stats/top-scorers/:tournamentId",
  MatchEventHandlers.getTopScorers,
);
router.get("/stats/standings/:tournamentId", TeamHandlers.getStandings);

app.use("/api", router);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
