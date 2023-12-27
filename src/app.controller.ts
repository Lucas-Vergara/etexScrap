import { Controller, Get, Request, Post, UseGuards, Body, Param, Delete, Put } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { UsersService } from './modules/users/users.service';
import { CreateUserDto } from './modules/users/dtos/createUser.dto';
import { GetUserEmail } from './auth/get-user.decorator';

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

  @UseGuards(JwtAuthGuard)
  @Post('/auth/register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/auth/change-password')
  async changePassword(
    @GetUserEmail() userEmail: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.userService.changePassword({
      email: userEmail,
      newPassword: newPassword
    });
  }

  @Get('/users')
  async getAllUsers(): Promise<{ id: string; email: string }[]> {
    return this.userService.getAllUsers();
  }

  @Delete('/users/:id')
  async deleteUser(@Param('id') userId: string): Promise<void> {
    return this.userService.deleteUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/auth/user')
  getUser(@Request() req) {
    return req.user
  }
}