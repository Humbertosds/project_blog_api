import jwt from 'jsonwebtoken';

export const createToken = async (id: string) => {
    const payload = {
        id
    }
    return jwt.sign(payload, process.env.JWT_SECRET as string)
}
