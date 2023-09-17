"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testingRouter = void 0;
const express_1 = require("express");
const testingRouter = (db) => {
    const router = (0, express_1.Router)();
    router.delete('/all-data', (req, res) => {
        db = [];
        let Resol;
        (function (Resol) {
            Resol[Resol["P123"] = 0] = "P123";
            Resol[Resol["P124"] = 1] = "P124";
            Resol[Resol["P125"] = 2] = "P125";
            Resol[Resol["P126"] = 3] = "P126";
        })(Resol || (Resol = {}));
        for (let item in Resol) {
        }
        res.sendStatus(204);
    });
    return router;
};
exports.testingRouter = testingRouter;
