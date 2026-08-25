import { handler as createPlayer } from "./CRUD/CreatePlayer";
import { handler as deletePlayer } from "./CRUD/DeletePlayer";
import { handler as getAllPlayers } from "./CRUD/GetAllPlayers";
import { handler as getPlayer } from "./CRUD/GetPlayer";
import { handler as getPlayerMatchHistory } from "./CRUD/GetPlayerMatchHistory";
import { handler as getPlayerTeamHistory } from "./CRUD/GetPlayerTeamHistory";
import { handler as getPlayersByTeam } from "./CRUD/GetPlayersByTeam";
import { handler as updatePlayer } from "./CRUD/UpdatePlayer";

export const PlayerHandlers = {
    createPlayer,
    deletePlayer,
    getAllPlayers,
    getPlayer,
    getPlayerMatchHistory,
    getPlayerTeamHistory,
    getPlayersByTeam,
    updatePlayer
};
