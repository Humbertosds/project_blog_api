import { RequestHandler } from "express";
import { createAdminSchema, createPostSchema } from "../schemas/admin.schemas";
import { createAdminService, createPost, findAdminByEmail, handleCover } from "../services/admin.service";
import { hash } from "argon2";
import uniqueSlug from "unique-slug";
import { findUserById } from "../services/auth.service";
import { coverWithUrlBase } from "../utils/coverWithBaseUrl";
import { generateUniqueSlug } from "../utils/generateUniqueSlug";

export const authAdmin: RequestHandler = async (req, res) => {
    res.json({ admin: req.user, token: req.authInfo })
}

export const createAdmin: RequestHandler = async (req, res) => {

    const safeData = createAdminSchema.safeParse(req.body);
    if (!safeData.success) {
        return res.json({ err: safeData.error.issues })
    }

    const { name, email, password } = safeData.data;

    const admin = await findAdminByEmail(email);
    if (admin) {
        return res.json({ err: 'Admin already exists' })
    }

    const hashPassword = await hash(password, { hashLength: 10 });

    const newAdmin = await createAdminService(name, email, hashPassword);

    return res.json({ admin: newAdmin });
};

export const postCreate: RequestHandler = async (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Acesso negado' });

    const tagsParse = JSON.parse(req.body.tags);

    const safeData = createPostSchema.safeParse({
        title: req.body.title,
        body: req.body.body,
        tags: tagsParse
    });

    if (!safeData.success) return res.json({ error: safeData.error.issues });

    const { title, body, tags } = safeData.data;

    // lidar com arquivo
    const cover = await handleCover(req.file);
    // criar slug do post
    const slug = await generateUniqueSlug(title);

    // criar post
    const postCreated = await createPost({
        authorId: req.user.id,
        slug,
        title,
        body,
        cover: coverWithUrlBase(cover),
        tags
    })

    // pegar infos do autor
    const author = await findUserById(postCreated.authorId);

    // retorno

    return res.status(201).json({
        post: {
            id: postCreated.id,
            authorName: author?.name,
            slug: postCreated.slug,
            title: postCreated.title,
            body: postCreated.body,
            createdAt: postCreated.createdAt,
            cover: coverWithUrlBase(postCreated.cover),
            tags: postCreated.tags,
            status: postCreated.status
        }
    })
};
