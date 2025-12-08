import sharp from "sharp";
import { prisma } from "../libs/prisma";
import fs from 'fs/promises';
import { v4 } from "uuid";
import { Prisma } from "../generated/prisma/client";

export const findAdminByEmail = async (email: string) => {
    return await prisma.user.findFirst({ where: { email, role: 'ADMIN' } })
}

export const findPostBySlug = async (slug: string) => {
    return await prisma.post.findFirst({
        where: { slug },
        include: {
            author: {
                select: {
                    name: true
                }
            }
        }
    })
}

export const createAdminService = async (name: string, email: string, password: string) => {
    return await prisma.user.create({ data: { name, email, password, role: 'ADMIN' } })
}

export const handleCover = async (file: Express.Multer.File | undefined) => {
    if (file) {
        try {
            let coverName = v4() + '.jpg';

            const cover = await sharp(file.path)
                .resize(500, 300).toBuffer();

            await sharp(cover)
                .toFile(`./public/images/covers/${coverName}`);

            await fs.unlink(file.path);
            return coverName;
        } catch (error) {
            console.log('erro interno', error);
            return null;
        }
    } else {
        return null
    }
}

export const handleAlterCover = async (file: Express.Multer.File | undefined) => {
    if (file) {
        try {
            let coverName = v4() + '.jpg';

            const cover = await sharp(file.path)
                .resize(500, 300).toBuffer();

            await sharp(cover)
                .toFile(`./public/images/covers/${coverName}`);

            await fs.unlink(file.path);
            return coverName;
        } catch (error) {
            console.log('erro interno', error);
            return undefined;
        }
    } else {
        return undefined
    }
}

type CreatePostProps = {
    authorId: string,
    slug: string,
    title: string,
    body: string,
    tags: string[],
    cover: string | null,
}

export const createPost = async (data: CreatePostProps) => {
    return await prisma.post.create({ data });
}

export const alterPost = async (slug: string, data: Prisma.PostUpdateInput) => {
    return await prisma.post.update({ where: { slug }, data });
}
