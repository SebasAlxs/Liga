"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchLineupHandlers = void 0;
const AddPlayerToLineup_1 = require("./CRUD/AddPlayerToLineup");
const GetMatchLineup_1 = require("./CRUD/GetMatchLineup");
const UpdatePlayerLineup_1 = require("./CRUD/UpdatePlayerLineup");
const DeletePlayerFromLineup_1 = require("./CRUD/DeletePlayerFromLineup");
exports.MatchLineupHandlers = {
    addPlayerToLineup: AddPlayerToLineup_1.handler,
    getMatchLineup: GetMatchLineup_1.handler,
    updatePlayerLineup: UpdatePlayerLineup_1.handler,
    deletePlayerFromLineup: DeletePlayerFromLineup_1.handler,
};
