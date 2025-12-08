import slug from "slug"
import { findPostBySlug } from "../services/admin.service";

export const generateUniqueSlug = async (title: string) => {
    let newSlug = slug(title);
    let keepTrying = true;
    let count = 1;

    while (keepTrying) {
        const post = await findPostBySlug(newSlug);
        if (!post) {
            keepTrying = false;
        } else {
            newSlug = slug(`${title}${++count}`)
        }
    }

    return newSlug;
}
