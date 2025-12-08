import { Router } from 'express';
import { MiddlewareJWT } from '../middlewares/jwt.middleware';

export const mainRouter = Router();

mainRouter.get('/ping', (req, res) => {
    res.json({ pong: true });
});

mainRouter.get('/posts', MiddlewareJWT);
mainRouter.get('/posts/:slug', MiddlewareJWT);
mainRouter.get('/posts/:slug/related', MiddlewareJWT);
