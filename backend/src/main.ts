import {
  ValidationPipe,
  Logger,
  ValidationError,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const STUDENT_ID = '22127015';
const DEFAULT_PORT = 3000;

interface ValidationErrorResponse {
  message: string;
}

/**
 * Creates a validation pipe with custom error handling
 * @returns Configured ValidationPipe instance
 */
function createValidationPipe(): ValidationPipe {
  return new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidUnknownValues: true,
    exceptionFactory: (errors: ValidationError[]): ValidationErrorResponse => {
      const [firstError] = errors;
      const [firstConstraint] = Object.values(firstError?.constraints || {});

      throw new BadRequestException(firstConstraint);
    },
  });
}

/**
 * Configures the application with necessary middleware and settings
 * @param app The NestJS application instance
 */
function configureApplication(app: any): void {
  app.enableCors();
  app.useGlobalPipes(createValidationPipe());
}

/**
 * Bootstrap the NestJS application
 * Sets up the server with all necessary configurations
 */
async function bootstrap(): Promise<void> {
  const logger = new Logger('Main');
  const app = await NestFactory.create(AppModule);

  configureApplication(app);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port') || DEFAULT_PORT;

  try {
    await app.listen(port);
    logger.log(`Application successfully started on port ${port} 🚀`);
    logger.log(`Student ID: ${STUDENT_ID}`);
  } catch (error) {
    logger.error(`Failed to start application: ${error.message}`);
    process.exit(1);
  }
}

// Initialize the application
void bootstrap();
