import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { AppError } from './AppError.js';
import fs from 'fs';

export const localAllowedTypes = {
  image: ['image/jpeg', 'image/png'],
  video: ['video/mp4'],
  document: ['application/pdf'],
};
export const multerFn = (folderName, fileValidation) => {
  let filePath = `uploads/${folderName}`;
  if (!fs.existsSync(filePath)) fs.mkdirSync(filePath, { recursive: true });
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, filePath);
    },
    filename: (req, file, cb) => {
      cb(null, uuidv4() + '-' + file.originalname);
    },
  });

  function fileFilter(req, file, cb) {
    if (fileValidation.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError('image only', 400), false);
    }
  }
  const upload = multer({ fileFilter, storage });
  return upload;
};
