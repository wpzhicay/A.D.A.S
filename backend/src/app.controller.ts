import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHome() {
    return {
      mensaje: 'Solar Generator Backend funcionando',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    };
  }
}
