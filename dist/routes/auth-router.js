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
    // -----
    router.get('/me', authMiddlware_1.authMiidleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        // const errors = validationResult(req)
        // if (!errors.isEmpty()) {
        //   const errorsArray = errors.array({ onlyFirstError: true })
        //   const errorsMessages = errorsArray.map((e) => ErrorFormatter(e))
        //   return res.status(400).send({ errorsMessages })
        // }
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
    router.post('/login', validation_1.validationMiidleware.loginOrEmailValidation, validation_1.validationMiidleware.passwordValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        // .custom(async (value) => {
        //   const user = await usersRepository.findUserByLoginOrEmail(value)
        //   console.log('98====valid', user)
        //   if (!user) throw new Error('user doesnt exist. you should register')
        //   return true
        // }),
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
    return router;
};
exports.authRouter = authRouter;
