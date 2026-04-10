"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeadquartersHandlers = void 0;
const CreateHeadquarters_1 = require("./CRUD/CreateHeadquarters");
const GetHeadquarters_1 = require("./CRUD/GetHeadquarters");
const UpdateHeadquarters_1 = require("./CRUD/UpdateHeadquarters");
const DeleteHeadquarters_1 = require("./CRUD/DeleteHeadquarters");
exports.HeadquartersHandlers = {
    createHeadquarters: CreateHeadquarters_1.handler,
    getAllHeadquarters: GetHeadquarters_1.handler,
    updateHeadquarters: UpdateHeadquarters_1.handler,
    deleteHeadquarters: DeleteHeadquarters_1.handler,
};
