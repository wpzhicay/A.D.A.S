import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DispositivosService } from './dispositivos.service';

@Controller('api/dispositivos')
@UseGuards(JwtAuthGuard)
export class DispositivosController {
  constructor(private dispositivosService: DispositivosService) {}

  @Post()
  async crearDispositivo(
    @Body() body: { nombre: string; serie: string },
    @Request() req: any,
  ) {
    return this.dispositivosService.crearDispositivo(body.nombre, body.serie, req.user.id);
  }

  @Get()
  async obtenerDispositivos(@Request() req: any) {
    return this.dispositivosService.obtenerDispositivosPorUsuario(req.user.id);
  }

  @Get(':id')
  async obtenerDispositivo(@Param('id') id: number, @Request() req: any) {
    return this.dispositivosService.obtenerDispositivo(id, req.user.id);
  }

  @Delete(':id')
  async eliminarDispositivo(@Param('id') id: number, @Request() req: any) {
    return this.dispositivosService.eliminarDispositivo(id, req.user.id);
  }
}
