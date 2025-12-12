import { NextFunction, Request, Response } from "express";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    if (res.headersSent) return next(err);
    const status = err.status || 500;
    const message = process.env.NODE_ENV === "production" ? "Erro interno do servidor" : err.message || "Erro interno";
    return res.status(status).json({ error: message });
};
