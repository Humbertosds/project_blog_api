import { RequestHandler } from "express";
import { alterPostSchema, createAdminSchema, createPostSchema } from "../schemas/admin.schemas";
import { alterPost, createAdminService, createPost, deletePost, findAdminByEmail, findPostBySlug, getAllPosts, handleAlterCover, handleCover } from "../services/admin.service";
import { hash } from "argon2";
import uniqueSlug from "unique-slug";
import { findUserById } from "../services/auth.service";
import { coverWithUrlBase, coverWithUrlBaseOrUndefined } from "../utils/coverWithBaseUrl";
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
            cover: postCreated.cover,
            tags: postCreated.tags,
            status: postCreated.status
        }
    })
};

export const allPostsGet: RequestHandler = async (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Acesso negado' });

    let page = 1;
    if (req.query.page) {
        page = parseInt(req.query.page as string);
        if (page <= 0 || !Number(page)) {
            return res.json({ error: 'Página inexistente' })
        }
    }

    const posts = await getAllPosts(page);

    const response = posts.map(post => ({
        id: post.id,
        status: post.status,
        title: post.title,
        createdAt: post.createdAt,
        cover: post.cover,
        authorName: post.author.name,
        tags: post.tags,
        slug: post.slug,
    }));

    return res.json({ posts: response, page })

}

export const onePostGet: RequestHandler = async (req, res) => {
    const { slug } = req.params;

    const post = await findPostBySlug(slug);
    if (!post) {
        return res.json({ error: 'Post inexistente' })
    }

    const response = {
        id: post.id,
        slug: post.slug,
        title: post.title,
        body: post.body,
        createdAt: post.createdAt,
        cover: post.cover,
        authorName: post.author.name,
        tags: post.tags
    }

    return res.json({ post: response });
}

export const postAlter: RequestHandler = async (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Acesso negado' });

    const { slug } = req.params;

    let tagsData: string[] | undefined;

    if (req.body.tags !== undefined) {
        try {
            tagsData = JSON.parse(req.body.tags)
        } catch (error) {
            return res.json({ error: 'Tags inválidas' })
        }
    }

    const safeData = alterPostSchema.safeParse({
        title: req.body.title,
        body: req.body.body,
        status: req.body.status,
        tags: tagsData
    });

    if (!safeData.success) return res.json({ error: safeData.error.issues });

    const post = await findPostBySlug(slug);
    if (!post) {
        return res.json({ error: 'Não existe post com esse slug' })
    }

    let cover: string | undefined = undefined;
    if (req.file) {
        cover = await handleAlterCover(req.file);
    }

    const { title, body, status, tags } = safeData.data;

    const updatedPost = await alterPost(
        slug,
        {
            title,
            body,
            status,
            tags,
            updatedAt: new Date(),
            cover: coverWithUrlBaseOrUndefined(cover)
        }
    );

    const author = await findUserById(updatedPost.authorId);

    return res.json({
        post: {
            id: updatedPost.id,
            title: updatedPost.title,
            body: updatedPost.body,
            slug: updatedPost.slug,
            status: updatedPost.status,
            createdAt: updatedPost.createdAt,
            updatedAt: updatedPost.updatedAt,
            cover: coverWithUrlBaseOrUndefined(cover),
            tags: updatedPost.tags,
            authorName: author?.name
        }
    })
}

export const postDelete: RequestHandler = async (req, res) => {
    const { slug } = req.params;

    const post = await findPostBySlug(slug);
    if (!post) {
        return res.json({ error: 'Post não existe' })
    }

    await deletePost(post.slug);

    res.json({ error: null })
}
