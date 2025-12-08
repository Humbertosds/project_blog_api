import sharp from "sharp";
import { prisma } from "../libs/prisma";
import fs from 'fs/promises';
import { v4 } from "uuid";

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
            const coverName = v4() + '.jpg';

            const cover = await sharp(file.path)
                .resize(400, 300).toBuffer();

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
