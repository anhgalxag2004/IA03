import { Logger } from '@nestjs/common/services/logger.service';
import { registerAs } from '@nestjs/config';

export default registerAs('database', () => {
  const logger = new Logger('DatabaseConfig');

  const {
    DATABASE_HOST,
    DATABASE_PORT,
    DATABASE_USERNAME,
    DATABASE_PASSWORD,
    DATABASE_NAME,
  } = process.env;

  // Determine if SSL is required based on the hostname
  const isRemoteDB = !['localhost', '127.0.0.1'].includes(
    DATABASE_HOST || 'localhost',
  );

  return {
    host: DATABASE_HOST,
    port: parseInt(DATABASE_PORT || '5432', 10),
    username: DATABASE_USERNAME,
    password: DATABASE_PASSWORD,
    database: DATABASE_NAME,
    type: 'postgres' as const,
    ssl: isRemoteDB ? { rejectUnauthorized: false } : false,
  };
});
