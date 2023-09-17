"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videosRouter = void 0;
const express_1 = require("express");
const db_1 = require("../db/db");
const videosRouter = (db) => {
    const router = (0, express_1.Router)();
    router.get('/', (req, res) => {
        const result = db.map((el) => {
            return {
                id: el.id,
                title: el.title,
                author: el.author,
                canBeDownloaded: el.canBeDownloaded,
                minAgeRestriction: el.minAgeRestriction,
                craetedAt: el.createdAt,
                publicationDate: el.publicationDate,
                availableResolutions: el.availableResolutions,
            };
        });
        console.log('20===video', result);
        res.status(200).json(result);
    });
    router.get('/:id', (req, res) => {
        const videoId = req.query;
        console.log('27===', req.query);
        const result = db.find((el) => el.id === videoId);
        res.status(200).send(result);
    });
    router.post('/', (req, res) => {
        const { title, author, availableResolutions } = req.body;
        console.log('32====', title);
        // validation
        const errorsMessages = [];
        if (!title ||
            !title.trim() ||
            typeof title !== 'string' ||
            title.length > 40) {
            console.log('42====');
            const field = 'title';
            const errorObject = {
                message: `inputModel has incorrect values. Incorrect field: ${field}`,
                field,
            };
            errorsMessages.push(errorObject);
            console.log('46===video', errorsMessages);
            res.status(400).send(errorsMessages);
            return;
        }
        if (!author || typeof author !== 'string' || author.length > 20) {
            const field = 'author';
            const errorObject = {
                message: `inputModel has incorrect values. Incorrect field: ${field}`,
                field,
            };
            errorsMessages.push(errorObject);
            console.log('59===video', errorsMessages);
            res.status(400).json(errorsMessages);
            return;
        }
        let newAvailibleResolution = null;
        if (availableResolutions && Array.isArray(availableResolutions)) {
            newAvailibleResolution = availableResolutions.filter((el) => {
                if (db_1.resolutions.includes(el)) {
                    return el;
                }
            });
        }
        if (!newAvailibleResolution) {
            const field = 'availableResolutions';
            const errorObject = {
                message: `inputModel has incorrect values. Incorrect field: ${field}`,
                field,
            };
            errorsMessages.push(errorObject);
            console.log('79===video', errorsMessages);
            res.status(400).json(errorsMessages);
            return;
        }
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
    });
    router.put('/:id', (req, res) => {
        let helloMessage = 'Hello Incubator!';
        res.send(helloMessage);
    });
    router.delete('/:id', (req, res) => {
        let helloMessage = 'Hello Incubator!';
        res.send(helloMessage);
    });
    return router;
};
exports.videosRouter = videosRouter;
