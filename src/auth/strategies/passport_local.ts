import { Strategy as StrategyLocal } from "passport-local";
import { findUserByEmail } from "../../services/auth.service";
import { verify } from "argon2";
import { createToken } from "../../libs/jsonwebtoken";

export const LocalStrategy = new StrategyLocal({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    const user = await findUserByEmail(email);
    if (!user) {
        return done({ message: 'Email não cadastrado' }, false)
    }

    const isPasswordValid = await verify(user.password, password);
    if (!isPasswordValid) {
        return done({ message: 'Senha incorreta' }, false)
    }

    const userToken = await createToken(user.id);

    const response = {
        token: userToken,
        user: {
            name: user.name,
            email: user.email,
            status: user.status,
            role: user.role
        }
    }

    return done(null, response);
})
