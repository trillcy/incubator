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
exports.startApp = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app_1 = require("./app");
const db_1 = require("./db/db");
// export const app = express()
// const port = 3004
// process.env.MONGO_URL
// app.use(express.json())
// export const RouterPaths = {
//   videos: '/videos',
//   testing: '/testing',
// }
// app.use(RouterPaths.videos, videosRouter(db))
// app.use(RouterPaths.testing, testingRouter(db))
const startApp = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_1.connectDb)();
    app_1.app.listen(process.env.PORT, () => {
        console.log(`Example app listening on port ${process.env.PORT}`);
    });
});
exports.startApp = startApp;
(0, exports.startApp)();
