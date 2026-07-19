import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../database/entities/usuario.entity';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
  ) {}

  async seedDatabase(): Promise<{ message: string; user: any }> {
    try {
      // Check if admin user already exists
      const adminExists = await this.usuariosRepository.findOne({
        where: { correo: 'admin@solar.com' },
      });

      if (adminExists) {
        return {
          message: 'Admin user already exists',
          user: {
            id: adminExists.id,
            nombre: adminExists.nombre,
            correo: adminExists.correo,
          },
        };
      }

      // Create admin user
      const hashedPassword = await bcrypt.hash('Admin@123', 10);

      const nuevoUsuario = this.usuariosRepository.create({
        nombre: 'Admin',
        correo: 'admin@solar.com',
        password: hashedPassword,
      });

      const usuarioGuardado = await this.usuariosRepository.save(nuevoUsuario);

      this.logger.log('✅ Admin user created successfully');

      return {
        message: 'Admin user created successfully',
        user: {
          id: usuarioGuardado.id,
          nombre: usuarioGuardado.nombre,
          correo: usuarioGuardado.correo,
        },
      };
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : String(error);
      this.logger.error(`❌ Error seeding database: ${errorMsg}`);
      throw error;
    }
  }

  async deleteAllUsers(): Promise<{ message: string; deletedCount: number }> {
    try {
      const result = await this.usuariosRepository.delete({});
      this.logger.log(`✅ Deleted ${result.affected} users`);
      return {
        message: 'All users deleted',
        deletedCount: result.affected || 0,
      };
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : String(error);
      this.logger.error(`❌ Error deleting users: ${errorMsg}`);
      throw error;
    }
  }
}
