"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamHandlers = void 0;
const CreateTeam_1 = require("./CRUD/CreateTeam");
const DeleteTeam_1 = require("./CRUD/DeleteTeam");
const GetAllTeams_1 = require("./CRUD/GetAllTeams");
const GetStandings_1 = require("./CRUD/GetStandings");
const GetTeam_1 = require("./CRUD/GetTeam");
const UpdateTeam_1 = require("./CRUD/UpdateTeam");
exports.TeamHandlers = {
    createTeam: CreateTeam_1.handler,
    deleteTeam: DeleteTeam_1.handler,
    getAllTeams: GetAllTeams_1.handler,
    getStandings: GetStandings_1.handler,
    getTeam: GetTeam_1.handler,
    updateTeam: UpdateTeam_1.handler
};
