import { Request, Response, NextFunction } from 'express';
const jwt = require('jsonwebtoken');
const Users = require('./models/users');

exports.verifyJwt = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['x-access-token'];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const email = decoded.email;
        await Users.findOne({ email: email});
        next();
    } catch (error) {
        next(error);
    }
}