import app from './app';
import { env } from './config/env';
import { prisma } from './config/db';
import logger from './utils/logger';

const shutdown = async () => {
  logger.info('Shutting down server...');
  await prisma.$disconnect();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

const startServer = async () => {
  try {
    await prisma.$connect();
    logger.info('Database connected successfully');

    app.listen(env.PORT, () => {
      logger.info(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
    });
  } catch (error) {
    logger.error({ error }, 'Failed to start server');    await prisma.$disconnect();
    process.exit(1);
  }
};

startServer();