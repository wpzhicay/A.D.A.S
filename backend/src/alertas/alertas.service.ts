import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Alerta } from '../database/entities/alerta.entity';

@Injectable()
export class AlertasService {
  constructor(
    @InjectRepository(Alerta)
    private alertasRepository: Repository<Alerta>,
  ) {}

  async crearAlerta(tipo: string, mensaje: string, idDispositivo: number) {
    const alerta = this.alertasRepository.create({
      tipo,
      mensaje,
      id_dispositivo: idDispositivo,
      fecha: new Date(),
      leida: false,
    });

    return this.alertasRepository.save(alerta);
  }

  async obtenerAlertas(idDispositivo: number) {
    return this.alertasRepository.find({
      where: { id_dispositivo: idDispositivo },
      order: { fecha: 'DESC' },
    });
  }

  async marcarComoLeida(idAlerta: number) {
    const alerta = await this.alertasRepository.findOne({ where: { id: idAlerta } });

    if (!alerta) {
      throw new NotFoundException('Alerta no encontrada');
    }

    alerta.leida = true;
    return this.alertasRepository.save(alerta);
  }

  async marcarTodasComoLeidas(idDispositivo: number) {
    return this.alertasRepository.update({ id_dispositivo: idDispositivo }, { leida: true });
  }

  async eliminarAlerta(idAlerta: number) {
    const alerta = await this.alertasRepository.findOne({ where: { id: idAlerta } });

    if (!alerta) {
      throw new NotFoundException('Alerta no encontrada');
    }

    return this.alertasRepository.remove(alerta);
  }
}
