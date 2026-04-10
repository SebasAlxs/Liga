"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TournamentHandlers = void 0;
const CreateTournament_1 = require("./CRUD/CreateTournament");
const GetAllTournaments_1 = require("./CRUD/GetAllTournaments");
const UpdateTournament_1 = require("./CRUD/UpdateTournament");
const DeleteTournament_1 = require("./CRUD/DeleteTournament");
const GetTournament_1 = require("./CRUD/GetTournament");
exports.TournamentHandlers = {
    createTournament: CreateTournament_1.handler,
    getAllTournaments: GetAllTournaments_1.handler,
    updateTournament: UpdateTournament_1.handler,
    deleteTournament: DeleteTournament_1.handler,
    getTournament: GetTournament_1.handler,
};
