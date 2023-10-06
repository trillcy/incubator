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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailManager = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
exports.emailManager = {
    sendEmailConfirmationMessage(emailObject) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('6+++++email', emailObject);
            // ==========
            const transporter = nodemailer_1.default.createTransport({
                service: 'gmail',
                auth: {
                    user: 'andreiincubator@gmail.com',
                    pass: 'uggx ujbd rsfr zzun',
                },
            });
            function main() {
                return __awaiter(this, void 0, void 0, function* () {
                    const info = yield transporter.sendMail({
                        from: 'andreiincubator@gmail.com',
                        to: emailObject.email,
                        subject: emailObject.subject,
                        // text: 'Hello world?', // plain text body
                        html: emailObject.message, // html body
                    });
                    console.log('35+++++email', info);
                    return info;
                });
            }
            return yield main().catch(console.error);
            // ==========
        });
    },
};
