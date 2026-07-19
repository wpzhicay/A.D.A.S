import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseService.name);

  constructor(private dataSource: DataSource) {}

  async onModuleInit() {
    // Check if database is connected
    try {
      if (this.dataSource.isInitialized) {
        this.logger.log('✅ Database connected successfully');
      }
    } catch (error) {
      this.logger.warn(
        `⚠️ Database connection status: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async isConnected(): Promise<boolean> {
    try {
      return this.dataSource.isInitialized;
    } catch {
      return false;
    }
  }

  getDataSource(): DataSource {
    return this.dataSource;
  }
}

