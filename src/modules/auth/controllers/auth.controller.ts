import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { RegistrationInputDto } from '../dto/registration-input.dto';
import { ConfirmCodeDto } from '../dto/confirm-code.input-dto';
import { JwtAuthGuard } from '../guards/bearer/jwt-auth.guard';
import { ExtractUserFromRequest } from '../../../core/decorators/transform/extract-user-from-request.decorator';
import { ResendingInputDto } from '../dto/resending.input-dto';
import { NewPasswordInputDto } from '../dto/new-password.input-dto';
import { LocalAuthGuard } from '../guards/local/local-auth.guard';
import { RequestDataEntity } from '../../../core/dto/request.data.entity';
import { RefreshTokenGuard } from '../guards/bearer/refresh.guard';
import { CurrentDevice } from '../../../core/decorators/transform/extract-device-from-token';
import { CommandBus } from '@nestjs/cqrs';
import { RefreshTokenCommand } from '../application/usecases/refresh-token.usecase';
import { TokensDto } from '../dto/tokens-dto';
import { LogoutCommand } from '../application/usecases/logout.usecase';
import type { Request, Response } from 'express';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly commandBus: CommandBus,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(
    @ExtractUserFromRequest() user: RequestDataEntity,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = this.authService.login(
      user.userId,
      user.userLogin,
    );
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true, // только https
      sameSite: 'strict',
      maxAge: 10 * 60 * 1000, // 10 минут
    });

    return { accessToken };
  }

  @Post('registration')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async register(@Body() dto: RegistrationInputDto) {
    await this.authService.registerUser(dto);
  }

  @Post('registration-confirmation')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async confirmRegistration(@Body() dto: ConfirmCodeDto) {
    return this.authService.confirmRegistration(dto.code);
  }

  @Post('registration-email-resending')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async resendConfirmationEmail(@Body() dto: ResendingInputDto) {
    return this.authService.resendConfirmationEmail(dto.email);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getUser(@ExtractUserFromRequest() user: RequestDataEntity) {
    return this.authService.getUserData(user.userId);
  }

  @Post('refresh-token')
  @UseGuards(RefreshTokenGuard)
  async refreshToken(
    @CurrentDevice() device: { userId: string; deviceId: string },
  ): Promise<TokensDto> {
    return await this.commandBus.execute(
      new RefreshTokenCommand(device.userId, device.deviceId),
    );
  }
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RefreshTokenGuard)
  async logout(@Req() req: Request) {
    const cookies = req.cookies as { refreshToken?: string } | undefined;
    const refreshToken = cookies?.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }
    await this.commandBus.execute(new LogoutCommand(refreshToken));
  }

  @Post('new-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async newPassword(@Body() dto: NewPasswordInputDto) {
    return this.authService.changePassword(dto.newPassword, dto.recoveryCode);
  }
  @Post('password-recovery')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async passwordRecovery(@Body() dto: ResendingInputDto) {
    return this.authService.passwordRecovery(dto.email);
  }
}
