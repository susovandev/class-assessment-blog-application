import path from "node:path";

export const ACCESS_TOKEN_TTL = 15 * 60; // 15 minutes in seconds
export const REFRESH_TOKEN_TTL = 30 * 24 * 60 * 60; // 30 days in seconds
export const MAX_FILE_SIZE_BYTES = "5mb";
export const MULTER_UPLOAD_PATH = path.join(process.cwd(), "public", "uploads");
export const CLOUDINARY_FOLDER_NAME = "blogs";
export const CLOUDINARY_RESOURCE_TYPE = "image";
