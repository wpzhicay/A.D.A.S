import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../database/entities/usuario.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
    private jwtService: JwtService,
  ) {}

  async login(correo: string, password: string) {
    const usuario = await this.usuariosRepository.findOne({ where: { correo } });

    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(password, usuario.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const token = this.jwtService.sign({ id: usuario.id, correo: usuario.correo });

    return {
      token,
      user: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
      },
    };
  }

  async register(nombre: string, correo: string, password: string) {
    // Verificar si el usuario ya existe
    const usuarioExistente = await this.usuariosRepository.findOne({ where: { correo } });

    if (usuarioExistente) {
      throw new BadRequestException('El correo ya está registrado');
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear nuevo usuario
    const nuevoUsuario = this.usuariosRepository.create({
      nombre,
      correo,
      password: hashedPassword,
    });

    const usuarioGuardado = await this.usuariosRepository.save(nuevoUsuario);

    // Generar token
    const token = this.jwtService.sign({ id: usuarioGuardado.id, correo: usuarioGuardado.correo });

    return {
      token,
      user: {
        id: usuarioGuardado.id,
        nombre: usuarioGuardado.nombre,
        correo: usuarioGuardado.correo,
      },
    };
  }
}
