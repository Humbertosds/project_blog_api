import { ExtractJwt, Strategy as StrategyJWT } from "passport-jwt";
import { findUserById } from "../../services/auth.service";

type JwtPayload = {
    id: string,
    name: string,
    email: string,
    status: boolean,
    role: string,
}

export const JWTStrategy = new StrategyJWT({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET as string
}, async (payload: JwtPayload, done) => {
    const { id } = payload;

    const user = await findUserById(id);
    if (!user) {
        return done(null, false)
    }

    const response = {
        id: user.id,
        name: user.name,
        email: user.email,
        status: user.status,
        role: user.role
    }

    return done(null, response);
})
