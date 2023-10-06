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
const validation_1 = require("../middlewares/validation");
const auth_services_1 = require("../domains/auth-services");
const jwt_services_1 = require("../applications/jwt-services");
const authMiddlware_1 = require("../middlewares/authMiddlware");
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
    // пинимает токен в заголовке
    // возвращает {userId, login, email}
    router.get('/me', authMiddlware_1.authMiidleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { user } = req;
        if (user) {
            const userOut = {
                userId: user.id,
                login: user.login,
                email: user.email,
            };
            res.status(200).json(userOut);
            return;
        }
        return res.sendStatus(401);
    }));
    // проверяет есть ли такой пользователь в БД
    // возвращает JWT token
    router.post('/login', validation_1.validationMiidleware.loginOrEmailValidation, validation_1.validationMiidleware.passwordValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            const errorsArray = errors.array({ onlyFirstError: true });
            const errorsMessages = errorsArray.map((e) => ErrorFormatter(e));
            return res.status(400).send({ errorsMessages });
        }
        const { loginOrEmail, password } = req.body;
        const user = yield auth_services_1.authService.checkCredential(loginOrEmail, password);
        if (user) {
            const token = yield jwt_services_1.jwtService.createJWT(user);
            return res.status(200).json({ accessToken: token });
        }
        return res.sendStatus(401);
    }));
    // регистрация пользователя
    // в middleware проверяем, что такого login и email нет
    // сохраняет user
    // отправляет письмо с подтверждением регистрации
    // возвращает только код 204
    router.post('/registration', validation_1.validationMiidleware.newLoginValidation, validation_1.validationMiidleware.newEmailValidation, validation_1.validationMiidleware.passwordValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            const errorsArray = errors.array({ onlyFirstError: true });
            const errorsMessages = errorsArray.map((e) => ErrorFormatter(e));
            return res.status(400).send({ errorsMessages });
        }
        const { login, email, password } = req.body;
        console.log('93----', login, email, password);
        const emailSuccess = yield auth_services_1.authService.registration(login, email, password);
        console.log('100----', emailSuccess);
        if (emailSuccess) {
            return res.sendStatus(204);
        }
        else {
            return res.sendStatus(444);
        }
    }));
    // в middleware проверяем наличие такого email ???
    // отправляет письмо с подтверждением регистрации
    // возвращает только код 204
    router.post('/registration-email-resending', validation_1.validationMiidleware.emailValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            const errorsArray = errors.array({ onlyFirstError: true });
            const errorsMessages = errorsArray.map((e) => ErrorFormatter(e));
            return res.status(400).send({ errorsMessages });
        }
        const { email } = req.body;
        console.log('128---auth', email);
        const emailSuccess = yield auth_services_1.authService.emailResending(email);
        console.log('129---auth', emailSuccess);
        if (emailSuccess) {
            return res.sendStatus(204);
        }
        else {
            return res.sendStatus(444);
        }
    }));
    // в middleware проверяем строку присланного кода - обычная строка ??? trim можно применять ???
    // проверяем код с записанным
    // возвращает только код 204
    router.post('/registration-confirmation', validation_1.validationMiidleware.codeValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            const errorsArray = errors.array({ onlyFirstError: true });
            const errorsMessages = errorsArray.map((e) => ErrorFormatter(e));
            return res.status(400).send({ errorsMessages });
        }
        const { code } = req.body;
        console.log('156----auth', code);
        const user = yield auth_services_1.authService.confirmationCode(code);
        if (user) {
            return res.sendStatus(204);
        }
        else {
            return res.sendStatus(400);
        }
    }));
    return router;
};
exports.authRouter = authRouter;
