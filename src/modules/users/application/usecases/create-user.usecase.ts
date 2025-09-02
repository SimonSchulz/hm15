import { BadRequestException } from '@nestjs/common';
import { InputUserDto } from '../../dto/user.input.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure/repositories/users.repository';
import { UsersQueryRepository } from '../../infrastructure/repositories/users.query.repository';
import { BcryptService } from '../../../auth/application/bcrypt.service';
import { User } from '../../domain/entities/user.entity';
export class CreateUserCommand {
  constructor(
    public readonly dto: InputUserDto,
    public readonly admin?: boolean,
  ) {}
}
@CommandHandler(CreateUserCommand)
export class CreateUserHandler
  implements ICommandHandler<CreateUserCommand, string>
{
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly bcryptService: BcryptService,
  ) {}

  async execute(command: CreateUserCommand): Promise<string> {
    const { dto, admin } = command;

    const existUser = await this.usersQueryRepository.findByLoginOrEmail(
      dto.email,
    );
    if (existUser) throw new BadRequestException('email already exists');

    dto.password = await this.bcryptService.generateHash(dto.password);

    const user = User.createUser(dto.login, dto.email, dto.password, admin);
    return this.usersRepository.create(user);
  }
}
