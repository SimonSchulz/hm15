import { CoreConfig } from './core/core.config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appSetup } from './app.setup';
import { UniversalExceptionFilter } from './core/exeptions/filters/domain-exceptions.filter';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const configService = appContext.get(ConfigService);
  const coreConfig = CoreConfig.create(configService);
  await appContext.close();
  const app = await NestFactory.create(AppModule.forRoot(coreConfig));
  app.enableCors();
  app.use(cookieParser());
  appSetup(app);
  app.useGlobalFilters(new UniversalExceptionFilter());
  const PORT = coreConfig.port;
  await app.listen(PORT, () => {
    console.log('App starting listen port: ', PORT);
    console.log('NODE_ENV: ', coreConfig.env);
  });
}
bootstrap();
