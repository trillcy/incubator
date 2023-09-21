"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRepository = void 0;
// ^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$
exports.authRepository = {
    auth(basicString) {
        const pattern = `Basic YWRtaW46cXdlcnR5`;
        return basicString === pattern ? true : false;
    },
};
