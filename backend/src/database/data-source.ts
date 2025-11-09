import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

const {
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  DATABASE_NAME,
} = process.env;

if (
  !DATABASE_HOST ||
  !DATABASE_PORT ||
  !DATABASE_USERNAME ||
  !DATABASE_PASSWORD ||
  !DATABASE_NAME
) {
  throw new Error(
    'Database configuration is incomplete. Please check your .env file.',
  );
}

// Determine if SSL is required based on the hostname
const isRemoteDB = !['localhost', '127.0.0.1'].includes(DATABASE_HOST);

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: DATABASE_HOST,
  port: parseInt(DATABASE_PORT, 10),
  username: DATABASE_USERNAME,
  password: DATABASE_PASSWORD,
  database: DATABASE_NAME,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
  logging: true,
  ssl: isRemoteDB ? { rejectUnauthorized: false } : false,
  extra: {
    family: 4,
  },
});
