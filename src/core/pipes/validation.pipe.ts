import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';

@Injectable()
export class CustomValidationPipe implements PipeTransform {
  transform(value: any) {
    // Здесь будет ваша валидация, например class-validator
    const errors: ValidationError[] = this.validateSomehow(value);
    if (errors.length) {
      const formattedErrors = errors.flatMap((err) => {
        if (err.constraints) {
          return Object.values(err.constraints).map((msg) => ({
            message: msg,
            field: err.property,
          }));
        }
        return [];
      });

      throw new BadRequestException({ errorsMessages: formattedErrors });
    }
    return value;
  }

  private validateSomehow(value: any): ValidationError[] {
    // Тестовая заглушка, реальная валидация через class-validator
    return [];
  }
}
