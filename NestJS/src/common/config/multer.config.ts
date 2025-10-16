import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerConfig = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const fileExtension = extname(file.originalname);
      const fileName = `${file.originalname.replace(fileExtension, '')}-${uniqueSuffix}${fileExtension}`;
      callback(null, fileName);
    },
  }),
};

export const audioLimits = { fileSize: 100 * 1024 * 1024 };
export const photoLimits = { fileSize: 1000 * 1024 * 1024 };
export const videoLimits = { fileSize: 1000 * 1024 * 1024 };
