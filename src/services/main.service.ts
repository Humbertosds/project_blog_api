import { prisma } from "../libs/prisma";

export const findPublishedPostBySlug = async (slug: string) => {
    return await prisma.post.findFirst({
        where: { slug, status: 'PUBLISHED' },
        include: {
            author: {
                select: {
                    name: true
                }
            }
        }
    })
}

export const getAllPosts = async (page: number) => {
    if (page <= 0) return [];
    const perPage = 2;

    const posts = await prisma.post.findMany({
        where: { status: 'PUBLISHED' },
        include: {
            author: {
                select: { name: true }
            }
        },
        orderBy: { createdAt: 'desc' },
        take: perPage,
        skip: (page - 1) * perPage,
    })

    return posts;
}

export const getSameTagsPosts = async (slug: string) => {
    const post = await prisma.post.findUnique({ where: { slug, status: 'PUBLISHED' } });
    if (!post) return [];

    const tags = post.tags;
    if (tags.length === 0) return []

    const posts = await prisma.post.findMany({
        where: {
            id: { not: post.id },
            tags: { hasSome: post.tags },
            status: 'PUBLISHED'
        },
        include: {
            author: {
                select: {
                    name: true
                }
            }
        },
        orderBy: { createdAt: 'desc' },
        take: 3
    })
    return posts
}
