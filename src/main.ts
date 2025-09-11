import { CoreConfig } from './core/core.config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appSetup } from './app.setup';
import { UniversalExceptionFilter } from './core/exeptions/filters/domain-exceptions.filter';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  // создаём временный контекст для ConfigService
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const configService = appContext.get(ConfigService);
  const coreConfig = CoreConfig.create(configService);
  await appContext.close();

  // собираем модуль с учётом coreConfig
  const dynamicModule = await AppModule.forRoot(coreConfig);

  // теперь создаём приложение
  const app = await NestFactory.create(dynamicModule);
  app.enableCors();
  appSetup(app);
  app.useGlobalFilters(new UniversalExceptionFilter());
  const PORT = coreConfig.port;
  await app.listen(PORT, () => {
    console.log('App starting listen port: ', PORT);
    console.log('NODE_ENV: ', coreConfig.env);
  });
}
bootstrap();
