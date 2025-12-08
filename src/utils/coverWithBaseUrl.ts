export const coverWithUrlBase = (path: string | null) => {
    return path ? `${process.env.BASE_URL}/public/images/covers/${path}` : null
}

export const coverWithUrlBaseOrUndefined = (path: string | undefined) => {
    return path ? `${process.env.BASE_URL}/public/images/covers/${path}` : undefined
}
