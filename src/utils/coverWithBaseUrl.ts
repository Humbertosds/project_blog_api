export const coverWithUrlBase = (path: string | null) => {
    return path ? `${process.env.BASE_URL}/public/images/covers` : null
}
