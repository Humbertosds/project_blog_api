import { RequestHandler } from "express";
import passport from "passport";

export const MiddlewareJWT: RequestHandler = async (req, res, next) => {
    const response = passport.authenticate('jwt', async (
        err: any,
        user: { id: string, name: string, email: string, status: boolean, role: string }
    ) => {
        if (user) {
            req.user = user;
            return next();
        }

        return res.status(403).json({ error: 'Acesso negado' })
    });
    response(req, res, next);
}
