import { handler as createMatch } from "./CRUD/CreateMatch";
import { handler as deleteMatch } from "./CRUD/DeleteMatch";
import { handler as getAllMatches } from "./CRUD/GetAllMatches";
import { handler as getMatch } from "./CRUD/GetMatch";
import { handler as updateMatch } from "./CRUD/UpdateMatch";

export const MatchHandlers = {
    createMatch,
    deleteMatch,
    getAllMatches,
    getMatch,
    updateMatch
};
