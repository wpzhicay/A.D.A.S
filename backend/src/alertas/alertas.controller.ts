import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AlertasService } from './alertas.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/alertas')
@UseGuards(JwtAuthGuard)
export class AlertasController {
  constructor(private alertasService: AlertasService) {}

  @Get()
  async obtenerAlertas(@Query('idDispositivo') idDispositivo: number) {
    return this.alertasService.obtenerAlertas(idDispositivo);
  }

  @Post()
  async crearAlerta(@Body() body: { tipo: string; mensaje: string; idDispositivo: number }) {
    return this.alertasService.crearAlerta(body.tipo, body.mensaje, body.idDispositivo);
  }

  @Patch(':id')
  async marcarComoLeida(@Param('id') id: number) {
    return this.alertasService.marcarComoLeida(id);
  }

  @Patch('dispositivo/:idDispositivo')
  async marcarTodasComoLeidas(@Param('idDispositivo') idDispositivo: number) {
    return this.alertasService.marcarTodasComoLeidas(idDispositivo);
  }

  @Delete(':id')
  async eliminarAlerta(@Param('id') id: number) {
    return this.alertasService.eliminarAlerta(id);
  }
}
