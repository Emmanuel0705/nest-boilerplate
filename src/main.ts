import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

config();

const port = process.env.PORT || 7481;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //enable versioning
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // enable global validation
  app.useGlobalPipes(new ValidationPipe());

  app.setGlobalPrefix('api');

  app.enableCors();

  // swagger
  const options = new DocumentBuilder()
    .setTitle('API Doc')
    .setDescription('explore the documnetation carefully ')
    .setVersion('1.0')
    .addServer('http://localhost:3003/', 'Local environment')
    .addServer('https://staging.yourapi.com/', 'Staging')
    .addServer('https://production.yourapi.com/', 'Production')
    .addTag('NMR Docs')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(port, () => {
    console.log(`Server running on Port :::->${port}`);
  });
}
bootstrap();
