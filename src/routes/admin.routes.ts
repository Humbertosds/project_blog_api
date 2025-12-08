import { Router } from 'express';
import { MiddlewareJWT } from '../middlewares/jwt.middleware';
import { upload } from '../libs/multer';
import { MiddlewareLocal } from '../middlewares/local.middleware';
import * as adminController from '../controllers/admin.controller';

export const adminRouter = Router();

adminRouter.get('/ping', (req, res) => {
    res.json({ pong: true });
});


adminRouter.post('/auth', MiddlewareLocal, adminController.authAdmin);
adminRouter.post('/auth/create', MiddlewareJWT, adminController.createAdmin);

adminRouter.post('/posts', MiddlewareJWT, upload.single('cover'), adminController.postCreate);
adminRouter.get('/posts', MiddlewareJWT);
adminRouter.get('/posts/:slug', MiddlewareJWT);
adminRouter.patch('/posts/:slug', MiddlewareJWT);
adminRouter.delete('/posts/:slug', MiddlewareJWT);
