import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { DbStatusController } from './db-status.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [HealthController, DbStatusController],
})
export class HealthModule {}
