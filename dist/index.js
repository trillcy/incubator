"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 3003;
app.get('/', (req, res) => {
    let helloMessage = 'Hello Incubator!';
    debugger;
    res.send(helloMessage);
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
