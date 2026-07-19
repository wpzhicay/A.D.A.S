import { Controller, Post, Delete } from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller('api/seed')
export class SeedController {
  constructor(private seedService: SeedService) {}

  @Post('init')
  async initDatabase() {
    return await this.seedService.seedDatabase();
  }

  @Delete('reset')
  async resetDatabase() {
    return await this.seedService.deleteAllUsers();
  }
}
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
