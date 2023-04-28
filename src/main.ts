import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import helmet from '@fastify/helmet';
import compression from '@fastify/compress';

import { AppModule } from './module';

// https://servicodados.ibge.gov.br/api/docs/localidades
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: {
        level: 'silent',
        transport: {
          target: 'pino-pretty',
          options: {
            translateTime: 'HH:MM:ss Z',
            ignore: 'pid,hostname,remotePort',
            singleLine: true,
          },
        },
      },
    }),
  );
  await app.register(helmet);
  await app.register(compression);
  await app.listen(3000, '0.0.0.0');
}

bootstrap();
