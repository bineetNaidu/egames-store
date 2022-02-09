import { Controller, Post, Body } from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() data: LoginDto): Promise<User> {
    return await this.authService.login(data);
  }

  @Post('register')
  async register(@Body() data: User): Promise<User> {
    return await this.authService.register(data);
  }
}
