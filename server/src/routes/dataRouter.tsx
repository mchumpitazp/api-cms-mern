const express = require('express');
import { Request, Response, NextFunction } from 'express';
const bodyParser = require('body-parser');
const fs = require('fs');
const authenticate = require('../authenticate');

const dataRouter = express.Router();
dataRouter.use(bodyParser.json());

dataRouter.route('/')
.get(authenticate.verifyJwt, async (req: Request, res: Response, _next: NextFunction) => {
    let database: {[key: string]: any} = {};
    const modelsPath = __dirname + '/../models';
    let modelsFiles = fs.readdirSync(modelsPath);
    modelsFiles = modelsFiles.filter((file: string) => !file.includes('users'));

    for (const file of modelsFiles) {
        const model = require(modelsPath + '/' + file);
        const arr = await model.find();
        if (arr.length) {
            const key = file.replace('.js', '');
            database[key] = arr;
        }
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(database);
})

module.exports = dataRouter;
export {};