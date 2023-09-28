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
exports.connectDb = exports.usersCollection = exports.postsCollection = exports.blogsCollection = exports.db = exports.videoDb = exports.Resolution = exports.resolutions = void 0;
const console_1 = require("console");
const mongodb_1 = require("mongodb");
exports.resolutions = [
    'P144',
    'P240',
    'P360',
    'P480',
    'P720',
    'P1080',
    'P1440',
    'P2160',
];
var Resolution;
(function (Resolution) {
    Resolution["P144"] = "P144";
    Resolution["P240"] = "P240";
    Resolution["P360"] = "P360";
    Resolution["P480"] = "P480";
    Resolution["P720"] = "P720";
    Resolution["P1080"] = "P1080";
    Resolution["P1440"] = "P1440";
    Resolution["P2160"] = "P2160";
})(Resolution || (exports.Resolution = Resolution = {}));
exports.videoDb = [];
const mongoURI = process.env.MONGO_URL || 'mongodb://0.0.0.0:27017';
const dbName = 'incubator';
const client = new mongodb_1.MongoClient(mongoURI);
exports.db = client.db(dbName);
exports.blogsCollection = exports.db.collection('blogs');
exports.postsCollection = exports.db.collection('posts');
exports.usersCollection = exports.db.collection('users');
const connectDb = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('46----', mongoURI);
        yield client.connect();
        console.log('49------123');
        yield exports.db.command({ ping: 1 });
        console.log('Connected successfully to server');
    }
    catch (e) {
        (0, console_1.log)({ e });
        (0, console_1.log)('cant connect to db');
    }
});
exports.connectDb = connectDb;
