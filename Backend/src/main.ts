import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  await app.listen(3000);
}
bootstrap();    