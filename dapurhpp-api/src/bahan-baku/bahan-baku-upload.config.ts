import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { BadRequestException } from '@nestjs/common';
import { randomUUID } from 'crypto';

export const UPLOAD_DIR = join(process.cwd(), 'uploads', 'bahan-baku');

// Ensure directory exists (skipped gracefully on read-only filesystems such as Vercel)
try {
  if (!existsSync(UPLOAD_DIR)) {
    mkdirSync(UPLOAD_DIR, { recursive: true });
  }
} catch (_e) {
  // On Vercel the filesystem is read-only; directory creation is not possible at startup.
  // Upload requests will fail at request-time rather than crashing the process at boot.
}

const imageFilter = (
  _req: any,
  file: Express.Multer.File,
  cb: (error: Error | null, accept: boolean) => void,
) => {
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new BadRequestException(
        'Hanya file gambar (jpg, jpeg, png, webp) yang diizinkan',
      ),
      false,
    );
  }
};

export const multerOptions = {
  storage: diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
    filename: (_req, file, cb) => {
      const ext = extname(file.originalname).toLowerCase();
      cb(null, `${randomUUID()}${ext}`);
    },
  }),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: imageFilter,
};
