import { Router } from 'express';
import { MiddlewareJWT } from '../middlewares/jwt.middleware';
import * as mainController from '../controllers/main.controller';

export const mainRouter = Router();

mainRouter.get('/ping', (req, res) => {
    res.json({ pong: true });
});

mainRouter.get('/posts', MiddlewareJWT, mainController.getAllposts);
mainRouter.get('/posts/:slug', MiddlewareJWT, mainController.getOnePost);
mainRouter.get('/posts/:slug/related', MiddlewareJWT, mainController.getPostsWithSameTags);
