import z from "zod";

export const signupSchema = z.object({
    name: z.string({ message: 'Name required' }).min(3, { message: 'Min 3 characters' }),
    email: z.email({ message: 'Email must be valid' }),
    password: z.string({ message: 'Password required' }).min(8, { message: 'Min 8 characters' })
})
