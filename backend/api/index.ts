import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import serverless from 'serverless-http';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';

let cachedHandler: any = null;

async function createServer() {
  const expressApp = express();
  const adapter = new ExpressAdapter(expressApp);

  const app = await NestFactory.create(AppModule, adapter, { abortOnError: false });

  // Keep basic middleware similar to main.ts
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidUnknownValues: true,
      exceptionFactory: (errors: any[]) => {
        const [firstError] = errors;
        const [firstConstraint] = Object.values(firstError?.constraints || {});
        throw new (require('@nestjs/common').BadRequestException)(firstConstraint);
      },
    }),
  );

  await app.init();
  return expressApp;
}

export default async function handler(req: any, res: any) {
  try {
    if (!cachedHandler) {
      const server = await createServer();
      cachedHandler = serverless(server);
    }
    return cachedHandler(req, res);
  } catch (err) {
    console.error('Serverless bootstrap error', err);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
}
