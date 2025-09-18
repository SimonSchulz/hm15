// import { CoreConfig } from './core/core.config';
// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { DynamicModule } from '@nestjs/common';
//
// export async function initAppModule(): Promise<DynamicModule> {
//   const appContext = await NestFactory.createApplicationContext(AppModule);
//   const coreConfig = appContext.get<CoreConfig>(CoreConfig);
//   await appContext.close();
//
//   return AppModule.forRoot(coreConfig);
// }
