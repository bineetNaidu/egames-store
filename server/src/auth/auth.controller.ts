import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthResponse } from './auth.response';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() data: LoginDto): Promise<AuthResponse> {
    return await this.authService.login(data);
  }

  @Post('register')
  async register(@Body() data: User): Promise<AuthResponse> {
    return await this.authService.register(data);
  }

  @Get('profile')
  async profile(@Req() req): Promise<Pick<AuthResponse, 'user'>> {
    return await this.authService.profile(req);
  }
}
