import { Router } from 'express';
import { MiddlewareJWT } from '../middlewares/jwt.middleware';
import { upload } from '../libs/multer';
import { MiddlewareLocal } from '../middlewares/local.middleware';
import * as adminController from '../controllers/admin.controller';
import { ensureAdmin } from '../middlewares/ensureAdmin';

export const adminRouter = Router();

adminRouter.get('/ping', (req, res) => {
    res.json({ pong: true });
});


adminRouter.post('/auth', MiddlewareLocal, adminController.authAdmin);
adminRouter.post('/auth/create', MiddlewareJWT, ensureAdmin, adminController.createAdmin);

adminRouter.post('/posts', MiddlewareJWT, ensureAdmin, upload.single('cover'), adminController.postCreate);
adminRouter.get('/posts', MiddlewareJWT, ensureAdmin, adminController.allPostsGet);
adminRouter.get('/posts/:slug', MiddlewareJWT, ensureAdmin, adminController.onePostGet);
adminRouter.patch('/posts/:slug', MiddlewareJWT, ensureAdmin, upload.single('cover'), adminController.postAlter);
adminRouter.delete('/posts/:slug', MiddlewareJWT, ensureAdmin, adminController.postDelete);
