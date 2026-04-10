"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthHandlers = void 0;
const Login_1 = require("./Login");
const Register_1 = require("./Register");
exports.AuthHandlers = {
    login: Login_1.handler,
    register: Register_1.handler,
};
