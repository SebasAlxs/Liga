import { handler as createTournament } from "./CRUD/CreateTournament";
import { handler as getAllTournaments } from "./CRUD/GetAllTournaments";
import { handler as updateTournament } from "./CRUD/UpdateTournament";
import { handler as deleteTournament } from "./CRUD/DeleteTournament";
import { handler as getTournament } from "./CRUD/GetTournament";

export const TournamentHandlers = {
    createTournament,
    getAllTournaments,
    updateTournament,
    deleteTournament,
    getTournament,
};
