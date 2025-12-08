import { RequestHandler } from "express";
import passport from "passport";

export const MiddlewareLocal: RequestHandler = async (req, res, next) => {
    const response = passport.authenticate('local', async (
        err: any,
        response: { token: string, user: { name: string, email: string, status: boolean, role: string } }
    ) => {
        if (response) {
            req.user = response.user;
            req.authInfo = response.token;
            return next();
        }

        return res.status(403).json({ error: err })
    });
    response(req, res, next);
}
