import { Controller, Post, Body } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../database/entities/usuario.entity';

@Controller('api/seed')
export class SeedController {
  constructor(
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
  ) {}

  @Post('create-test-user')
  async createTestUser() {
    // Check if user already exists
    const existingUser = await this.usuariosRepository.findOne({
      where: { correo: 'admin@test.com' },
    });

    if (existingUser) {
      return {
        message: 'Test user already exists',
        user: {
          id: existingUser.id,
          nombre: existingUser.nombre,
          correo: existingUser.correo,
        },
      };
    }

    // Create test user
    const hashedPassword = await bcrypt.hash('password123', 10);

    const testUser = this.usuariosRepository.create({
      nombre: 'Admin Test',
      correo: 'admin@test.com',
      password: hashedPassword,
    });

    const savedUser = await this.usuariosRepository.save(testUser);

    return {
      message: 'Test user created successfully',
      user: {
        id: savedUser.id,
        nombre: savedUser.nombre,
        correo: savedUser.correo,
      },
      credentials: {
        email: 'admin@test.com',
        password: 'password123',
      },
    };
  }

  @Post('create-sample-users')
  async createSampleUsers() {
    const users = [
      { nombre: 'Wilson Mendoza', correo: 'wilson@example.com', password: 'password123' },
      { nombre: 'Juan García', correo: 'juan@example.com', password: 'password123' },
      { nombre: 'María López', correo: 'maria@example.com', password: 'password123' },
    ];

    const createdUsers = [];

    for (const userData of users) {
      const existing = await this.usuariosRepository.findOne({
        where: { correo: userData.correo },
      });

      if (!existing) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = this.usuariosRepository.create({
          nombre: userData.nombre,
          correo: userData.correo,
          password: hashedPassword,
        });
        const saved = await this.usuariosRepository.save(user);
        createdUsers.push({
          id: saved.id,
          nombre: saved.nombre,
          correo: saved.correo,
        });
      }
    }

    return {
      message: `${createdUsers.length} users created`,
      users: createdUsers,
    };
  }
}
