"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerHandlers = void 0;
const CreatePlayer_1 = require("./CRUD/CreatePlayer");
const DeletePlayer_1 = require("./CRUD/DeletePlayer");
const GetAllPlayers_1 = require("./CRUD/GetAllPlayers");
const GetPlayer_1 = require("./CRUD/GetPlayer");
const GetPlayersByTeam_1 = require("./CRUD/GetPlayersByTeam");
const UpdatePlayer_1 = require("./CRUD/UpdatePlayer");
exports.PlayerHandlers = {
    createPlayer: CreatePlayer_1.handler,
    deletePlayer: DeletePlayer_1.handler,
    getAllPlayers: GetAllPlayers_1.handler,
    getPlayer: GetPlayer_1.handler,
    getPlayersByTeam: GetPlayersByTeam_1.handler,
    updatePlayer: UpdatePlayer_1.handler
};
