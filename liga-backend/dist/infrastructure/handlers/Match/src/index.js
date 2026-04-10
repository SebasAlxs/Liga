"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchHandlers = void 0;
const CreateMatch_1 = require("./CRUD/CreateMatch");
const DeleteMatch_1 = require("./CRUD/DeleteMatch");
const GetAllMatches_1 = require("./CRUD/GetAllMatches");
const GetMatch_1 = require("./CRUD/GetMatch");
const UpdateMatch_1 = require("./CRUD/UpdateMatch");
exports.MatchHandlers = {
    createMatch: CreateMatch_1.handler,
    deleteMatch: DeleteMatch_1.handler,
    getAllMatches: GetAllMatches_1.handler,
    getMatch: GetMatch_1.handler,
    updateMatch: UpdateMatch_1.handler
};
