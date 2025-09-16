import { CoreConfig } from './core/core.config';
import { configModule } from './config-dynamic-module';
import { DynamicModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigService } from '@nestjs/config';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TestingModule } from './modules/testing/testing.module';
import { UsersModule } from './modules/users/users.module';
import { BloggerPlatformModule } from './modules/blogger-platform/blogger-platform.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { RefreshTokenModule } from './modules/auth/refresh.token.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 10,
        limit: 5,
      },
    ]),
    RefreshTokenModule.forRoot(),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    BloggerPlatformModule,
    configModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  static async forRoot(coreConfig: CoreConfig): Promise<DynamicModule> {
    // такой мудрёный способ мы используем, чтобы добавить к основным модулям необязательный модуль.
    // чтобы не обращаться в декораторе к переменной окружения через process.env в декораторе, потому что
    // запуск декораторов происходит на этапе склейки всех модулей до старта жизненного цикла самого NestJS

    return {
      module: AppModule,
      imports: [...(coreConfig.includeTestingModule ? [TestingModule] : [])], // Add dynamic modules here
    };
  }
}
