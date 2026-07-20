import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dispositivo } from '../database/entities/dispositivo.entity';

@Injectable()
export class DispositivosService {
  constructor(
    @InjectRepository(Dispositivo)
    private dispositivosRepository: Repository<Dispositivo>,
  ) {}

  async crearDispositivo(nombre: string, serie: string, idUsuario: number) {
    // Verificar que el usuario no tenga más de 3 dispositivos
    const dispositivosCount = await this.dispositivosRepository.count({
      where: { id_usuario: idUsuario },
    });

    if (dispositivosCount >= 3) {
      throw new BadRequestException('No puedes tener más de 3 dispositivos');
    }

    // Verificar que la serie sea única
    const dispositivoExistente = await this.dispositivosRepository.findOne({
      where: { serie },
    });

    if (dispositivoExistente) {
      throw new BadRequestException('La serie del dispositivo ya existe');
    }

    const nuevoDispositivo = this.dispositivosRepository.create({
      nombre,
      serie,
      id_usuario: idUsuario,
      estado: 'OFFLINE',
    });

    return this.dispositivosRepository.save(nuevoDispositivo);
  }

  async obtenerDispositivosPorUsuario(idUsuario: number) {
    return this.dispositivosRepository.find({
      where: { id_usuario: idUsuario },
    });
  }

  async obtenerTodos() {
    return this.dispositivosRepository.find();
  }

  async obtenerDispositivo(id: number, idUsuario: number) {
    const dispositivo = await this.dispositivosRepository.findOne({
      where: { id, id_usuario: idUsuario },
    });

    if (!dispositivo) {
      throw new NotFoundException('Dispositivo no encontrado');
    }

    return dispositivo;
  }

  async actualizarEstado(id: number, estado: string) {
    await this.dispositivosRepository.update(id, { estado });
  }

  async eliminarDispositivo(id: number, idUsuario: number) {
    const dispositivo = await this.obtenerDispositivo(id, idUsuario);
    await this.dispositivosRepository.remove(dispositivo);
  }
}
