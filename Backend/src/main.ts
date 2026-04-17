import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { AppModule } from './app.module';
import config from './config/env.config';

async function bootstrap() {
    const logger = new Logger('Bootstrap');
    const app = await NestFactory.create(AppModule);
    app.getHttpAdapter().getInstance().set('trust proxy', 1);

    const normalizedFrontendOrigin = config.FRONTEND_URL.trim().replace(/\/+$/, '');
    const allowedOrigins = [normalizedFrontendOrigin, 'http://localhost:5173'];

    app.enableCors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
                return;
            }
            callback(new Error(`Origin ${origin} not allowed by CORS`));
        },
        credentials: true,
    });
    app.use(cookieParser());
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    try {
        const openApiDocument = JSON.parse(
            readFileSync(
                join(process.cwd(), 'openapi', 'taskflow.swagger.json'),
                'utf-8',
            ),
        );

        SwaggerModule.setup('api-docs', app, openApiDocument, {
            jsonDocumentUrl: 'api-docs/json',
            customSiteTitle: 'TaskFlow API Docs',
        });
    } catch (error) {
        logger.warn(
            'Skipping Swagger setup: openapi/taskflow.swagger.json missing or invalid JSON',
        );
        logger.debug(error);
    }
    app.setGlobalPrefix('api');
    await app.listen(config.PORT);
}
bootstrap();
