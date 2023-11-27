import { Controller, Get, Request, Post, UseGuards, Body, Param, Delete } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { UsersService } from './modules/users/users.service';
import { CreateUserDto } from './modules/users/dto/createUser.dto';
import { User } from './modules/users/users.model';

@Controller('api')
export class AppController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('/auth/login')
  async login(@Request() req) {
    return this.authService.signIn(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('auth/check')
  checkAuth(@Request() req) {
    return {
      authenticated: true,
      message: 'El usuario está autenticado',
    };
  }

  @Post('/auth/register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get('/users')
  async getAllUsers(): Promise<{ id: string; email: string }[]> {
    return this.userService.getAllUsers();
  }

  @Delete('/users/:id')
  async deleteUser(@Param('id') userId: string): Promise<void> {
    return this.userService.deleteUser(userId);
  }
}