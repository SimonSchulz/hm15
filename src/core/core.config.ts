// core.config.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Matches,
} from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { configValidationUtility } from './setup/config-validation.utility';

export enum Environments {
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production',
  TESTING = 'testing',
}

@Injectable()
export class CoreConfig {
  @IsNumber({}, { message: 'Set Env variable PORT, example: 3000' })
  port!: number;

  @IsNotEmpty({
    message:
      'Set Env variable MONGO_URI, example: mongodb://localhost:27017/my-app-local-db',
  })
  @Matches(/^mongodb(?:\+srv)?:\/\/.*/, {
    message:
      'MONGO_URI must be a valid MongoDB connection string (mongodb:// or mongodb+srv://)',
  })
  mongoURI!: string;

  @IsEnum(Environments, {
    message:
      'Set correct NODE_ENV value, available values: ' +
      configValidationUtility.getEnumValues(Environments).join(', '),
  })
  env?: Environments;
  @IsOptional()
  @IsBoolean({
    message:
      'Set Env variable IS_SWAGGER_ENABLED, example: true, available values: true, false',
  })
  isSwaggerEnabled?: boolean;
  @IsOptional()
  @IsBoolean({
    message:
      'Set Env variable INCLUDE_TESTING_MODULE, example: true, available values: true, false, 0, 1',
  })
  includeTestingModule?: boolean;
  @IsOptional()
  @IsBoolean({
    message:
      'Set Env variable SEND_INTERNAL_SERVER_ERROR_DETAILS, example: true, available values: true, false, 0, 1',
  })
  sendInternalServerErrorDetails?: boolean;

  /**
   * Фабрика для создания и валидации конфига
   */
  static create(configService: ConfigService): CoreConfig {
    const plainConfig = {
      port: Number(configService.get('PORT')),
      mongoURI: configService.get<string>('MONGO_URI'),
      env: configService.get<Environments>('NODE_ENV'),
      isSwaggerEnabled: configValidationUtility.convertToBoolean(
        configService.get('IS_SWAGGER_ENABLED') ?? 'false',
      ),
      includeTestingModule: configValidationUtility.convertToBoolean(
        configService.get('INCLUDE_TESTING_MODULE') ?? 'true',
      ),
      sendInternalServerErrorDetails: configValidationUtility.convertToBoolean(
        configService.get('SEND_INTERNAL_SERVER_ERROR_DETAILS') ?? 'false',
      ),
    };

    const cfg = plainToInstance(CoreConfig, plainConfig, {
      enableImplicitConversion: true, // конвертирует строки в boolean/number
    });

    const errors = validateSync(cfg, { whitelist: true });
    if (errors.length > 0) {
      throw new Error(
        '❌ Invalid environment configuration: ' +
          JSON.stringify(errors, null, 2),
      );
    }

    return cfg;
  }
}
