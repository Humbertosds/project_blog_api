import { RequestHandler } from "express";
import { signupSchema } from "../schemas/auth.schemas";
import { createUser, findUserByEmail } from "../services/auth.service";
import { hash } from "argon2";

export const signup: RequestHandler = async (req, res) => {
    const safeData = signupSchema.safeParse(req.body);
    if (!safeData.success) {
        return res.status(400).json({ err: safeData.error.issues })
    }

    const { name, email, password } = safeData.data;

    const user = await findUserByEmail(email);
    if (user) {
        return res.json({ error: 'Email já cadastrado' })
    }

    const hashPassword = await hash(password, { hashLength: 10 })

    const newUser = await createUser(name, email, hashPassword);

    if (!newUser) {
        return res.json({ error: 'Falha ao criar usuario' })
    }

    return res.json({ user: newUser })
}

export const signin: RequestHandler = async (req, res) => {
    res.json({ user: req.user, auth: req.authInfo })
}

export const validate: RequestHandler = async (req, res) => {
    res.json({ user: req.user })
}
