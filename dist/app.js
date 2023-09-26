"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = exports.RouterPaths = void 0;
const express_1 = __importDefault(require("express"));
const testing_router_1 = require("./routes/testing-router");
const blogs_router_1 = require("./routes/blogs-router");
const posts_router_1 = require("./routes/posts-router");
// import { videoDb } from './db/db'
exports.RouterPaths = {
    videos: '/videos',
    testing: '/testing',
    blogs: '/blogs',
    posts: '/posts',
};
exports.app = (0, express_1.default)();
// const port = 3004
exports.app.use(express_1.default.json());
// app.use(RouterPaths.videos, videosRouter(videoDb))
exports.app.use(exports.RouterPaths.testing, (0, testing_router_1.testingRouter)());
exports.app.use(exports.RouterPaths.blogs, (0, blogs_router_1.blogsRouter)());
exports.app.use(exports.RouterPaths.posts, (0, posts_router_1.postsRouter)());
