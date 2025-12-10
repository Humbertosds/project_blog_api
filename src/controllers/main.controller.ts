import { RequestHandler } from "express";
import { findPublishedPostBySlug, getAllPosts, getSameTagsPosts } from "../services/main.service";
import { findPostBySlug } from "../services/admin.service";

export const getAllposts: RequestHandler = async (req, res) => {
    if (!req.user) return res.json({ error: 'Acesso negado' })

    let page = 1;
    if (req.query.page) {
        page = parseInt(req.query.page as string);
        if (page <= 0 || !Number(page)) {
            return res.json({ error: 'Página inexistente' })
        }
    }

    const posts = await getAllPosts(page);

    // id, title, createdAt, cover, authorName, tags, slug
    const response = posts.map(post => ({
        id: post.id,
        slug: post.slug,
        title: post.title,
        createdAt: post.createdAt,
        cover: post.cover,
        tags: post.tags,
        authorName: post.author.name
    }));

    return res.json({ posts: response, page })
}

export const getOnePost: RequestHandler = async (req, res) => {
    if (!req.user) return res.json({ error: 'Acesso negado' })
    const { slug } = req.params;

    const post = await findPublishedPostBySlug(slug);
    if (!post) {
        return res.json({ error: 'Post inexistente' })
    }

    // id, title, createdAt, cover, authorName, tags, body, slug
    const response = {
        id: post.id,
        slug: post.slug,
        title: post.title,
        body: post.body,
        createdAt: post.createdAt,
        cover: post.cover,
        tags: post.tags,
        authorName: post.author.name
    }

    return res.json({ post: response })
}

export const getPostsWithSameTags: RequestHandler = async (req, res) => {
    if (!req.user) return res.json({ error: 'Acesso negado' })

    const { slug } = req.params;

    const post = await findPublishedPostBySlug(slug);
    if (!post) {
        return res.json({ error: 'Post inexistente' })
    }

    if (post.tags.length === 0) {
        return res.json({ posts: [] })
    }

    const posts = await getSameTagsPosts(post.slug);

    return res.json({ posts_related: posts })
}
