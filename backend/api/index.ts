import 'source-map-support/register';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import serverless from 'serverless-http';
import { AppModule } from '../src/app.module';

const expressApp = express();
let handler: any | null = null;

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
    { logger: ['error', 'warn', 'log'] },
  );

  // Make sure body parsing works
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Initialize Nest
  await app.init();

  // Return serverless handler
  return serverless(expressApp);
}

export default async function (req: any, res: any) {
  if (!handler) {
    handler = await bootstrap();
  }
  return handler(req, res);
}
