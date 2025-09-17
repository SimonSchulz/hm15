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
import { RefreshTokenModule } from './modules/auth/refresh.token.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    BloggerPlatformModule,
    configModule,
    RefreshTokenModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  static forRoot(coreConfig: CoreConfig): DynamicModule {
    const dynamicImports = coreConfig.includeTestingModule
      ? [TestingModule]
      : [];
    return {
      module: AppModule,
      imports: dynamicImports,
    };
  }
}
