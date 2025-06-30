import multer from "multer";
import path from "path";
import fs from "fs";

const tempDir = path.resolve("public/temp");
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, tempDir),
  filename: (_req, file, cb) => {
    const stamp = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext   = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${stamp}${ext}`);
  },
});

export const upload = multer({ storage });
