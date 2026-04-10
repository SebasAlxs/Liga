import { handler as addPlayerToLineup } from "./CRUD/AddPlayerToLineup";
import { handler as getMatchLineup } from "./CRUD/GetMatchLineup";
import { handler as updatePlayerLineup } from "./CRUD/UpdatePlayerLineup";
import { handler as deletePlayerFromLineup } from "./CRUD/DeletePlayerFromLineup";

export const MatchLineupHandlers = {
    addPlayerToLineup,
    getMatchLineup,
    updatePlayerLineup,
    deletePlayerFromLineup,
};
