import { existsSync, mkdirSync } from 'node:fs';
import { extname, join } from 'node:path';
import { BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import config from '../../config/env.config';
import { AUTH_MESSAGES } from '../messages/auth.messages';

const ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

function isAllowedAvatarFile(file: {
    mimetype?: string;
    originalname?: string;
}): boolean {
    const mime = (file.mimetype ?? '').toLowerCase().split(';')[0].trim();
    const ext = extname(file.originalname ?? '').toLowerCase();

    if (ALLOWED_MIME_TYPES.includes(mime)) return true;

    if (mime === 'application/octet-stream') {
        return ALLOWED_EXTENSIONS.includes(ext);
    }

    return false;
}

function ensureTempDir(): string {
    const tempDir = join(process.cwd(), config.AVATAR_TEMP_DIR);

    if (!existsSync(tempDir)) {
        mkdirSync(tempDir, { recursive: true });
    }

    return tempDir;
}

export const AvatarUploadInterceptor = FileInterceptor('avatar', {
    fileFilter: (_request, file, callback) => {
        if (isAllowedAvatarFile(file)) {
            callback(null, true);
            return;
        }

        callback(
            new BadRequestException(
                AUTH_MESSAGES.errors.avatarMimeTypeNotAllowed,
            ),
            false,
        );
    },
    storage: diskStorage({
        destination: (_request, _file, callback) => {
            callback(null, ensureTempDir());
        },
        filename: (request, file, callback) => {
            const requestUser = (request as { user?: { id?: string } }).user;
            const userId =
                typeof requestUser?.id === 'string' ? requestUser.id : '';
            const extension = extname(file.originalname).toLowerCase();
            const tempFileName = `avatar-${userId}-${Date.now()}${extension}`;
            callback(null, tempFileName);
        },
    }),
});
