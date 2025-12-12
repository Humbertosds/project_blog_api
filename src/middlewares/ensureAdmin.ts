// middleware para garantir role ADMIN
import { RequestHandler } from "express";

export const ensureAdmin: RequestHandler = (req, res, next) => {
    const user = req.user as any;
    if (!user) return res.status(401).json({ error: "Acesso negado" });
    if (user.role !== "ADMIN") return res.status(403).json({ error: "Permissão negada" });
    return next();
};
