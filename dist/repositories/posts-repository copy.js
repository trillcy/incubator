"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRepository = void 0;
const postsDb_1 = require("../db/postsDb");
// ^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$
exports.postsRepository = {
    findAll() {
        return postsDb_1.postsDb;
    },
    findOne(id) {
        const result = postsDb_1.postsDb.find((el) => el.id === id);
        return result;
    },
    delete(id) {
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
    },
    update(id, title, shortDescription, content, blogId) {
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
    },
    create(title, shortDescription, content, blogId) {
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
    },
};
