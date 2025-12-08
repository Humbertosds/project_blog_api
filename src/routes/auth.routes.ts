import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { MiddlewareLocal } from '../middlewares/local.middleware';
import { MiddlewareJWT } from '../middlewares/jwt.middleware';

export const authRouter = Router();

authRouter.get('/ping', (req, res) => {
    res.json({ pong: true });
});

authRouter.post('/signup', authController.signup);
authRouter.post('/signin', MiddlewareLocal, authController.signin);
authRouter.get('/validate', MiddlewareJWT, authController.validate);
