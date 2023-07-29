import { Request, Response, NextFunction } from 'express';
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Users = require('../models/users');

const userRouter = express.Router();
userRouter.use(bodyParser.json());

userRouter.route('/register')
.post(async (req: Request, res: Response) => {
    try {
        const newPassword = await bcrypt.hash(req.body.password, 10);
        await Users.create({
            name: req.body.name,
            email: req.body.email,
            password: newPassword
        });
        res.json({ status: 'ok' });
    } catch (error) {
        console.log(error);
        res.json({ status: 'error', error: 'Error creating user.' });
    }
})

userRouter.route('/login')
.post(async (req: Request, res: Response) => {
    const user = await Users.findOne({
        email: req.body.email
    });

    if (!user) return res.json({ status: 'error', user: false })

    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
    
    if (isPasswordValid) {
        const token = jwt.sign({
            name: user.name,
            email: user.email
        }, process.env.JWT_SECRET_KEY, { expiresIn: 60 }); 
        return res.json({ status: 'ok', user: token })
    } else {
        return res.json({ status: 'error', user: false })
    }
    
});

module.exports = userRouter;
export {};