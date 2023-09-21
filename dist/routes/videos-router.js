"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videosRouter = void 0;
const express_1 = require("express");
const db_1 = require("../db/db");
const videosRouter = (db) => {
    const router = (0, express_1.Router)();
    router.get('/', (req, res) => {
        res.status(200).json(db);
    });
    router.get('/:id', (req, res) => {
        const resId = +req.params.id;
        if (!Number.isInteger(resId)) {
            res.sendStatus(404);
            return;
        }
        const videoId = resId;
        const result = db.find((el) => el.id === videoId);
        if (result) {
            res.status(200).json(result);
        }
        else {
            res.sendStatus(404);
        }
    });
    router.post('/', (req, res) => {
        const { title, author, availableResolutions } = req.body;
        // validation
        const errorsArray = [];
        if (!title ||
            title === null ||
            !title.trim() ||
            typeof title !== 'string' ||
            title.length > 40) {
            const field = 'title';
            const errorObject = {
                message: `inputModel has incorrect values. Incorrect field: ${field}`,
                field,
            };
            errorsArray.push(errorObject);
        }
        if (!author ||
            author === null ||
            typeof author !== 'string' ||
            author.length > 20) {
            const field = 'author';
            const errorObject = {
                message: `inputModel has incorrect values. Incorrect field: ${field}`,
                field,
            };
            errorsArray.push(errorObject);
        }
        let newAvailibleResolution = null;
        if (availableResolutions !== null) {
            if (!availableResolutions || !Array.isArray(availableResolutions)) {
                const field = 'availableResolutions';
                const errorObject = {
                    message: `inputModel has incorrect values. Incorrect field: ${field}`,
                    field,
                };
                errorsArray.push(errorObject);
            }
            else {
                const checkedArray = availableResolutions.filter((el) => {
                    if (db_1.resolutions.includes(el)) {
                        return el;
                    }
                });
                if (checkedArray.length !== availableResolutions.length) {
                    const field = 'availableResolutions';
                    const errorObject = {
                        message: `inputModel has incorrect values. Incorrect field: ${field}`,
                        field,
                    };
                    errorsArray.push(errorObject);
                }
                else {
                    newAvailibleResolution = checkedArray;
                }
            }
        }
        if (!errorsArray.length) {
            const newDate = new Date();
            const newNextDate = newDate;
            const newCreatedDate = newDate.toISOString();
            const newPublishedDate = new Date(newNextDate.setDate(newNextDate.getDate() + 1)).toISOString();
            const newVideo = {
                id: +new Date(),
                title,
                author,
                canBeDownloaded: false,
                minAgeRestriction: null,
                createdAt: newCreatedDate,
                publicationDate: newPublishedDate,
                availableResolutions: newAvailibleResolution,
            };
            db.push(newVideo);
            res.status(201).json(newVideo);
        }
        else {
            const result = { errorsMessages: errorsArray };
            res.status(400).json(result);
            return;
        }
    });
    router.put('/:id', (req, res) => {
        const resId = +req.params.id;
        if (!Number.isInteger(resId)) {
            res.sendStatus(404);
            return;
        }
        const videoId = resId;
        const foundElement = db.find((el) => el.id === videoId);
        if (!foundElement) {
            res.sendStatus(404);
            return;
        }
        const { title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate, } = req.body;
        // validation
        const errorsArray = [];
        if (!title ||
            title === null ||
            !title.trim() ||
            typeof title !== 'string' ||
            title.length > 40) {
            const field = 'title';
            const errorObject = {
                message: `inputModel has incorrect values. Incorrect field: ${field}`,
                field,
            };
            errorsArray.push(errorObject);
        }
        if (!author ||
            author === null ||
            typeof author !== 'string' ||
            author.length > 20) {
            const field = 'author';
            const errorObject = {
                message: `inputModel has incorrect values. Incorrect field: ${field}`,
                field,
            };
            errorsArray.push(errorObject);
        }
        let newAvailibleResolution = null;
        if (availableResolutions !== null) {
            if (!availableResolutions || !Array.isArray(availableResolutions)) {
                const field = 'availableResolutions';
                const errorObject = {
                    message: `inputModel has incorrect values. Incorrect field: ${field}`,
                    field,
                };
                errorsArray.push(errorObject);
            }
            else {
                const checkedArray = availableResolutions.filter((el) => {
                    if (db_1.resolutions.includes(el)) {
                        return el;
                    }
                });
                if (checkedArray.length !== availableResolutions.length) {
                    const field = 'availableResolutions';
                    const errorObject = {
                        message: `inputModel has incorrect values. Incorrect field: ${field}`,
                        field,
                    };
                    errorsArray.push(errorObject);
                }
                else {
                    newAvailibleResolution = checkedArray;
                }
            }
        }
        if (!canBeDownloaded || typeof canBeDownloaded !== 'boolean') {
            const field = 'canBeDownloaded';
            const errorObject = {
                message: `inputModel has incorrect values. Incorrect field: ${field}`,
                field,
            };
            errorsArray.push(errorObject);
        }
        if (!minAgeRestriction ||
            typeof minAgeRestriction !== 'number' ||
            !Number.isInteger(minAgeRestriction) ||
            minAgeRestriction < 1 ||
            minAgeRestriction > 18) {
            const field = 'minAgeRestriction';
            const errorObject = {
                message: `inputModel has incorrect values. Incorrect field: ${field}`,
                field,
            };
            errorsArray.push(errorObject);
        }
        if (!publicationDate ||
            typeof publicationDate !== 'string' ||
            !Number.isInteger(Date.parse(publicationDate))) {
            const field = 'publicationDate';
            const errorObject = {
                message: `inputModel has incorrect values. Incorrect field: ${field}`,
                field,
            };
            errorsArray.push(errorObject);
        }
        if (!errorsArray.length) {
            const updatedVideo = {
                id: foundElement.id,
                title,
                author,
                canBeDownloaded: canBeDownloaded ? canBeDownloaded : false,
                minAgeRestriction: minAgeRestriction ? minAgeRestriction : null,
                createdAt: foundElement.createdAt,
                publicationDate,
                availableResolutions: newAvailibleResolution,
            };
            const index = db.indexOf(foundElement);
            db[index] = updatedVideo;
            res.sendStatus(204);
        }
        else {
            const result = { errorsMessages: errorsArray };
            res.status(400).json(result);
            return;
        }
    });
    router.delete('/:id', (req, res) => {
        const resId = +req.params.id;
        if (!Number.isInteger(resId)) {
            res.sendStatus(404);
            return;
        }
        const videoId = resId;
        const result = db.find((el) => el.id === videoId);
        if (result) {
            const index = db.indexOf(result);
            db.splice(index, 1);
            res.sendStatus(204);
        }
        else {
            res.sendStatus(404);
        }
    });
    return router;
};
exports.videosRouter = videosRouter;
