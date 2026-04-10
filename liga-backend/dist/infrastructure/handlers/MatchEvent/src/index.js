"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchEventHandlers = void 0;
const AddMatchEvent_1 = require("./CRUD/AddMatchEvent");
const GetMatchEvents_1 = require("./CRUD/GetMatchEvents");
const GetTopScorers_1 = require("./CRUD/GetTopScorers");
const DeleteMatchEvent_1 = require("./CRUD/DeleteMatchEvent");
exports.MatchEventHandlers = {
    addMatchEvent: AddMatchEvent_1.handler,
    getMatchEvents: GetMatchEvents_1.handler,
    getTopScorers: GetTopScorers_1.handler,
    deleteMatchEvent: DeleteMatchEvent_1.handler,
};
