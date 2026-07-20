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

