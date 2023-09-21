"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startApp = exports.RouterPaths = void 0;
const express_1 = __importDefault(require("express"));
const videos_router_1 = require("./routes/videos-router");
const testing_router_1 = require("./routes/testing-router");
const db_1 = require("./db/db");
const blogs_router_1 = require("./routes/blogs-router");
exports.RouterPaths = {
    videos: '/videos',
    testing: '/testing',
    blogs: '/blogs',
};
const startApp = () => {
    const app = (0, express_1.default)();
    // const port = 3003
    app.use(express_1.default.json());
    app.use(exports.RouterPaths.videos, (0, videos_router_1.videosRouter)(db_1.db));
    app.use(exports.RouterPaths.testing, (0, testing_router_1.testingRouter)(db_1.db));
    app.use(exports.RouterPaths.blogs, (0, blogs_router_1.blogsRouter)());
    return app;
};
exports.startApp = startApp;
