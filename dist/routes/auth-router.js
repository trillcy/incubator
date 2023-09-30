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
exports.authRouter = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const auth_services_1 = require("../domains/auth-services");
const ErrorFormatter = (error) => {
    switch (error.type) {
        case 'field':
            return {
                message: error.msg,
                field: error.path,
            };
        default:
            return {
                message: error.msg,
                field: 'None',
            };
    }
};
const authRouter = () => {
    const router = (0, express_1.Router)();
    router.post('/login', 
    // validationMiidleware.loginOrEmailValidation,
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('40----auth.router', req.body);
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            const errorsArray = errors.array({ onlyFirstError: true });
            const errorsMessages = errorsArray.map((e) => ErrorFormatter(e));
            return res.status(400).send({ errorsMessages });
        }
        const { loginOrEmail, password } = req.body;
        const checkResult = yield auth_services_1.authService.checkCredential(loginOrEmail, password);
        if (checkResult) {
            return res.sendStatus(204);
        }
        return res.sendStatus(401);
    }));
    return router;
};
exports.authRouter = authRouter;
