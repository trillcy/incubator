"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRepository = void 0;
const blogsDb_1 = require("../db/blogsDb");
// ^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$
exports.blogsRepository = {
    findAll() {
        return blogsDb_1.blogsDb;
    },
    findById(id) {
        const result = blogsDb_1.blogsDb.find((el) => el.id === id);
        return result;
    },
    delete(id) {
        let foundIndex = null;
        for (let index = 0; index < blogsDb_1.blogsDb.length; index++) {
            if (blogsDb_1.blogsDb[index].id === id) {
                foundIndex = index;
            }
        }
        if (foundIndex !== null) {
            blogsDb_1.blogsDb.splice(foundIndex, 1);
            return true;
        }
        else {
            return false;
        }
    },
    update(id, name, description, websiteUrl) {
        let foundIndex = null;
        for (let index = 0; index < blogsDb_1.blogsDb.length; index++) {
            if (blogsDb_1.blogsDb[index].id === id) {
                foundIndex = index;
            }
        }
        if (foundIndex !== null) {
            const newElement = {
                id: blogsDb_1.blogsDb[foundIndex].id,
                name,
                description,
                websiteUrl,
            };
            blogsDb_1.blogsDb[foundIndex] = newElement;
            return true;
        }
        else {
            return false;
        }
    },
    create(name, description, websiteUrl) {
        let foundIndex = null;
        for (let index = 0; index < blogsDb_1.blogsDb.length; index++) {
            if (blogsDb_1.blogsDb[index].name === name &&
                blogsDb_1.blogsDb[index].websiteUrl === websiteUrl &&
                blogsDb_1.blogsDb[index].description === description) {
                foundIndex = index;
            }
        }
        if (foundIndex !== null) {
            return blogsDb_1.blogsDb[foundIndex];
        }
        else {
            const date = new Date();
            const id = `${blogsDb_1.blogsDb.length}-${date.toISOString()}`;
            const newElement = { id, name, description, websiteUrl };
            blogsDb_1.blogsDb.push(newElement);
            return newElement;
        }
    },
};
