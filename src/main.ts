import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { satisfies } from 'semver';
import { engines } from '../package.json';
import { Logger, VersioningType } from '@nestjs/common';
import { CustomValidationPipe } from '@utils/pipes';
import {
  BaseExceptionFilter,
  HttpExceptionFilter,
  TypeormExceptionFilter,
} from '@utils/filters';
import * as winston from 'winston';
import {
  WinstonModule,
  utilities as nestWinstonModuleUtil,
} from 'nest-winston';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

function createNewrelicWinstonFormatter() {
  const newrelicFormatter = require('@newrelic/winston-enricher');
  return newrelicFormatter(winston);
}

async function bootstrap() {
  const nodeVersion = engines.node;
  if (!satisfies(process.version, nodeVersion)) {
    console.log(
      `Required node version ${nodeVersion} not satisfied with current version ${process.version}.`,
    );
    process.exit();
  }

  const app = await NestFactory.create(AppModule);

  app.useLogger(
    WinstonModule.createLogger({
      level: process.env.ENV === 'production' ? 'info' : 'debug',
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            winston.format.json(),
            createNewrelicWinstonFormatter()(),
            nestWinstonModuleUtil.format.nestLike('Tessera', {
              prettyPrint: true,
              colors: true,
            }),
          ),
        }),
      ],
    }),
  );

  app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.useGlobalPipes(
    new CustomValidationPipe({
      whitelist: true,
      transform: true,
      stopAtFirstError: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const logger = new Logger();
  app.useGlobalFilters(
    new BaseExceptionFilter(logger),
    new HttpExceptionFilter(logger),
    new TypeormExceptionFilter(logger),
  );

  process.on('unhandledRejection', (reason, promise) => {
    logger.error({
      reason,
      promise,
      message: 'Unhandled Rejection',
    });
  });

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: '*',
    credentials: false,
  });
  const config = new DocumentBuilder().setTitle('Apps').build();
  const document = SwaggerModule.createDocument(app, config, {
    include: [AppModule],
    deepScanRoutes: true,
  });
  SwaggerModule.setup('api/docs', app, document);

  app.enableShutdownHooks();

  await app.listen(3000);
}
bootstrap();
