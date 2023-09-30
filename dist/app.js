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
const users_router_1 = require("./routes/users-router");
const auth_router_1 = require("./routes/auth-router");
const comments_router_1 = require("./routes/comments-router");
// import { videoDb } from './db/db'
exports.RouterPaths = {
    videos: '/videos',
    testing: '/testing',
    blogs: '/blogs',
    posts: '/posts',
    users: '/users',
    auth: '/auth',
    comments: '/comments',
};
exports.app = (0, express_1.default)();
// const port = 3004
exports.app.use(express_1.default.json());
// app.use(RouterPaths.videos, videosRouter(videoDb))
exports.app.use(exports.RouterPaths.testing, (0, testing_router_1.testingRouter)());
exports.app.use(exports.RouterPaths.blogs, (0, blogs_router_1.blogsRouter)());
exports.app.use(exports.RouterPaths.posts, (0, posts_router_1.postsRouter)());
exports.app.use(exports.RouterPaths.users, (0, users_router_1.usersRouter)());
exports.app.use(exports.RouterPaths.auth, (0, auth_router_1.authRouter)());
exports.app.use(exports.RouterPaths.comments, (0, comments_router_1.commentsRouter)());
