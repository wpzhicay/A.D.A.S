import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull } from 'typeorm';

import { Medicion } from '../database/entities/medicion.entity';
import { Dispositivo } from '../database/entities/dispositivo.entity';
import { CreateMedicionDto } from './dto/create-medicion.dto';

@Injectable()
export class MedicionesService {

  constructor(
    @InjectRepository(Medicion)
    private medicionRepository: Repository<Medicion>,

    @InjectRepository(Dispositivo)
    private dispositivoRepository: Repository<Dispositivo>,
  ) {}

  async create(dto: CreateMedicionDto) {

    const dispositivo = await this.dispositivoRepository.findOne({
      where: { id: dto.id_dispositivo },
    });

    if (!dispositivo) {
      throw new NotFoundException('Dispositivo no encontrado');
    }

    const medicion = this.medicionRepository.create({
      ...dto,
      fecha: dto.fecha ?? new Date(),
    });

    return this.medicionRepository.save(medicion);
  }

  async findAll() {
    return this.medicionRepository.find({
      relations: ['dispositivo'],
      order: {
        fecha: 'DESC',
      },
    });
  }

  async findByDispositivo(id: number) {
    return this.medicionRepository.find({
      where: {
        id_dispositivo: id,
      },
      order: {
        fecha: 'DESC',
      },
    });
  }

  async findRuta() {
    return this.medicionRepository.find({
      select: {
        latitud: true,
        longitud: true,
        fecha: true,
      },
      where: {
        latitud: Not(IsNull()),
        longitud: Not(IsNull()),
      },
      order: {
        fecha: 'ASC',
      },
    });
  }
}