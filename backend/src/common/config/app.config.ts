import { registerAs } from '@nestjs/config';

export default registerAs('app', () => {
  return {
    port: parseInt(process.env.PORT!, 10) || 3000,
    jwt: {
      accessSecret: process.env.JWT_ACCESS_SECRET || 'your-access-secret-key',
      accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || 900, // 15 minutes in seconds
      refreshSecret:
        process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
      refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || 604800, // 7 days in seconds
    },
  };
});
