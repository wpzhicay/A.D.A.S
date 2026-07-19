import { Controller, Get } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Controller('db-status')
export class DbStatusController {
  constructor(private databaseService: DatabaseService) {}

  @Get()
  async status() {
    const isConnected = await this.databaseService.isConnected();
    return {
      status: isConnected ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString(),
    };
  }
}
