import multer from "multer";

const allowedFiles = ['image/jpg', 'image/png', 'image/webp', 'image/jpeg'];

export const upload = multer({
    fileFilter(req, file, callback) {
        callback(null, allowedFiles.includes(file.mimetype))
    },
    dest: 'tmp/covers'
})
