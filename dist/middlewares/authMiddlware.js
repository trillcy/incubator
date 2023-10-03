"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiidleware = void 0;
const jwt_services_1 = require("../applications/jwt-services");
const users_services_1 = require("../domains/users-services");
const authMiidleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // проверка наличия заголовка
    if (!req.headers.authorization) {
        res.sendStatus(401);
        return;
    }
    // TODO: проверить наличие пользователя и валидность токена
    const token = req.headers.authorization.split(' ')[1];
    const userId = yield jwt_services_1.jwtService.getUserIdByToken(token);
    if (userId) {
        // Если все норм, то получить user и вставить его в req
        req.user = yield users_services_1.usersService.findUserById(userId);
        next();
        return;
    }
    res.send(401);
});
exports.authMiidleware = authMiidleware;
