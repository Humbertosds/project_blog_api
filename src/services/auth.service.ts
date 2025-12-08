import { prisma } from "../libs/prisma"

export const findUserByEmail = async (email: string) => {
    return await prisma.user.findFirst({ where: { email } })
}

export const findUserById = async (id: string) => {
    return await prisma.user.findFirst({ where: { id } })
}

export const createUser = async (name: string, email: string, password: string) => {
    return await prisma.user.create({ data: { name, email, password, role: 'USER' } })
}
