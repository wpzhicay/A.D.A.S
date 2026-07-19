import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('api')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: { correo: string; password: string }) {
    return this.authService.login(body.correo, body.password);
  }

  @Post('auth/register')
  async register(@Body() body: { nombre: string; correo: string; password: string }) {
    return this.authService.register(body.nombre, body.correo, body.password);
  }
}
