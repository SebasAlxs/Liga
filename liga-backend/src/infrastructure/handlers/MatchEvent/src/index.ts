import { handler as addMatchEvent } from "./CRUD/AddMatchEvent";
import { handler as getMatchEvents } from "./CRUD/GetMatchEvents";
import { handler as getTopScorers } from "./CRUD/GetTopScorers";
import { handler as deleteMatchEvent } from "./CRUD/DeleteMatchEvent";

export const MatchEventHandlers = {
    addMatchEvent,
    getMatchEvents,
    getTopScorers,
    deleteMatchEvent,
};
