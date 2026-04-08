import 'dotenv/config';

const DEFAULT_DEV_SECRET = 'dev_secret_change_me';

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
