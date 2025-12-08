import z from "zod";

export const createAdminSchema = z.object({
    name: z.string().min(3),
    email: z.email(),
    password: z.string().min(8)
});

export const createPostSchema = z.object({
    title: z.string().min(3),
    body: z.string().min(3),
    tags: z.array(z.string())
})
