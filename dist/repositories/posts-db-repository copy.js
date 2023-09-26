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
exports.postsRepository = void 0;
const postsDb_1 = require("../db/postsDb");
// ^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$
exports.postsRepository = {
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return postsDb_1.postsDb;
        });
    },
    findOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = postsDb_1.postsDb.find((el) => el.id === id);
            return result;
        });
    },
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let foundIndex = null;
            for (let index = 0; index < postsDb_1.postsDb.length; index++) {
                if (postsDb_1.postsDb[index].id === id) {
                    foundIndex = index;
                }
            }
            if (foundIndex !== null) {
                postsDb_1.postsDb.splice(foundIndex, 1);
                return true;
            }
            else {
                return false;
            }
        });
    },
    update(id, title, shortDescription, content, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            let foundIndex = null;
            for (let index = 0; index < postsDb_1.postsDb.length; index++) {
                if (postsDb_1.postsDb[index].id === id) {
                    foundIndex = index;
                }
            }
            if (foundIndex !== null) {
                const newElement = {
                    id: postsDb_1.postsDb[foundIndex].id,
                    title,
                    shortDescription,
                    content,
                    blogId,
                };
                postsDb_1.postsDb[foundIndex] = newElement;
                return true;
            }
            else {
                return false;
            }
        });
    },
    create(title, shortDescription, content, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            let foundIndex = null;
            for (let index = 0; index < postsDb_1.postsDb.length; index++) {
                if (postsDb_1.postsDb[index].title === title &&
                    postsDb_1.postsDb[index].shortDescription === shortDescription &&
                    postsDb_1.postsDb[index].content === content &&
                    postsDb_1.postsDb[index].blogId === blogId) {
                    foundIndex = index;
                }
            }
            if (foundIndex !== null) {
                return postsDb_1.postsDb[foundIndex];
            }
            else {
                const date = new Date();
                const id = `${postsDb_1.postsDb.length}-${date.toISOString()}`;
                const newElement = {
                    id,
                    title,
                    shortDescription,
                    content,
                    blogId,
                };
                postsDb_1.postsDb.push(newElement);
                return newElement;
            }
        });
    },
};
