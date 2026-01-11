import {MAX_FILE_SIZE_BYTES, MULTER_UPLOAD_PATH} from "../constants/index.js";
import multer from "multer";
import path from "node:path";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, MULTER_UPLOAD_PATH);
  },
  filename: (_req, file, cb) => {
    const companyName = "company_blog";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;

    let uniqueName = companyName;
    for (let i = 0; i < 10; i++) {
      uniqueName += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

const fileFilter = (_req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type, only JPEG and PNG allowed"));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
  },
});

export {upload};
