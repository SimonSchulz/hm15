import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  NotFoundException,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { UsersQueryRepository } from '../infrastructure/repositories/users.query.repository';
import { InputUserDto } from '../dto/user.input.dto';
import { UsersQueryParams } from '../dto/users-query-params.input-dto';
import { BasicAuthGuard } from '../../auth/guards/basic/basic-auth.guard';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '../application/usecases/create-user.usecase';
import { DeleteUserCommand } from '../application/usecases/delete-user.usecase';
@UseGuards(BasicAuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly usersQueryRepository: UsersQueryRepository,
  ) {}

  @Get()
  async getUsers(@Query() query: UsersQueryParams) {
    return this.usersQueryRepository.findAllUsers(query);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() dto: InputUserDto) {
    const admin = true;
    const userId: string = await this.commandBus.execute(
      new CreateUserCommand(dto, admin),
    );
    const newUser = await this.usersQueryRepository.findById(userId);
    if (!newUser) throw new BadRequestException('Invalid user data');
    return newUser;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id') id: string) {
    const deleted: boolean = await this.commandBus.execute(
      new DeleteUserCommand(id),
    );
    if (!deleted) throw new NotFoundException('User does not exist');
  }
}
