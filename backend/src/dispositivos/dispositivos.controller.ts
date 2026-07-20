import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DispositivosService } from './dispositivos.service';

@Controller('api/dispositivos')
export class DispositivosController {
  constructor(private dispositivosService: DispositivosService) {}

  // Endpoint público para obtener todos los dispositivos (sin autenticación)
  @Get('publico')
  async obtenerTodosPublico() {
    return this.dispositivosService.obtenerTodos();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async crearDispositivo(
    @Body() body: { nombre: string; serie: string },
    @Request() req: any,
  ) {
    return this.dispositivosService.crearDispositivo(body.nombre, body.serie, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async obtenerDispositivos(@Request() req: any) {
    return this.dispositivosService.obtenerDispositivosPorUsuario(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async obtenerDispositivo(@Param('id') id: number, @Request() req: any) {
    return this.dispositivosService.obtenerDispositivo(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async eliminarDispositivo(@Param('id') id: number, @Request() req: any) {
    return this.dispositivosService.eliminarDispositivo(id, req.user.id);
  }
}
