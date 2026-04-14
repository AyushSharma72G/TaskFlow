import 'dotenv/config';

const DEFAULT_DEV_SECRET = 'dev_secret_change_me';
const DEFAULT_AVATAR_MAX_SIZE_BYTES = 5 * 1024 * 1024;

function parsePositiveNumber(
    value: string | undefined,
    fallback: number,
): number {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

const config = {
    PORT: Number(process.env.PORT ?? 3000),
    NODE_ENV: process.env.NODE_ENV ?? 'development',
    FRONTEND_URL: process.env.FRONTEND_URL ?? 'http://localhost:5173',
    DATABASE_URL: process.env.DATABASE_URL ?? '',
    JWT_SECRET: process.env.JWT_SECRET ?? DEFAULT_DEV_SECRET,
    REFRESH_TOKEN_SECRET:
        process.env.REFRESH_TOKEN_SECRET ??
        process.env.JWT_SECRET ??
        DEFAULT_DEV_SECRET,
    ACCESS_TOKEN_EXPIRES_IN:
        process.env.ACCESS_TOKEN_EXPIRES_IN ??
        process.env.JWT_EXPIRES_IN ??
        '15m',
    REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN ?? '7d',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? '7d',
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ?? '',
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ?? '',
    GOOGLE_CALLBACK_URL:
        process.env.GOOGLE_CALLBACK_URL ??
        'http://localhost:3000/api/auth/google/callback',
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID ?? '',
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET ?? '',
    GITHUB_CALLBACK_URL:
        process.env.GITHUB_CALLBACK_URL ??
        'http://localhost:3000/api/auth/github/callback',
    AVATAR_FOLDER: process.env.AVATAR_FOLDER ?? 'avatars/users',
    AVATAR_TEMP_DIR: process.env.AVATAR_TEMP_DIR ?? 'tmp/avatars',
    AVATAR_MAX_SIZE_BYTES: parsePositiveNumber(
        process.env.AVATAR_MAX_SIZE_BYTES,
        DEFAULT_AVATAR_MAX_SIZE_BYTES,
    ),
    AVATAR_UPLOAD_RETRY_COUNT: parsePositiveNumber(
        process.env.AVATAR_UPLOAD_RETRY_COUNT,
        3,
    ),

    GEMINI_API_KEY: process.env.GEMINI_API_KEY ?? '',

    EMAILJS_SERVICE_ID: process.env.EMAILJS_SERVICE_ID ?? '',
    EMAILJS_TEMPLATE_ID: process.env.EMAILJS_TEMPLATE_ID ?? '',
    EMAILJS_PUBLIC_KEY: process.env.EMAILJS_PUBLIC_KEY ?? '',
    EMAILJS_PRIVATE_KEY: process.env.EMAILJS_PRIVATE_KEY ?? '',
    SEND_MAIL_URL: process.env.SEND_MAIL_URL ?? 'https://api.emailjs.com/api/v1.0/email/send',
    INVITE_BASE_URL: process.env.INVITE_BASE_URL ?? 'http://localhost:5173',
};

if (config.NODE_ENV === 'production') {
    if (!config.DATABASE_URL) {
        throw new Error('DATABASE_URL is required in production');
    }

    if (config.JWT_SECRET === DEFAULT_DEV_SECRET) {
        throw new Error('JWT_SECRET must be configured in production');
    }

    if (config.REFRESH_TOKEN_SECRET === DEFAULT_DEV_SECRET) {
        throw new Error(
            'REFRESH_TOKEN_SECRET must be configured in production',
        );
    }
}

export default config;
