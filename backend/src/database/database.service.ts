import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { Dispositivo } from './entities/dispositivo.entity';
import { Medicion } from './entities/medicion.entity';
import { Alerta } from './entities/alerta.entity';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseService.name);
  private dataSource: DataSource | null = null;
  private connectionAttempts = 0;
  private readonly maxRetries = 5;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    // Try to connect to database asynchronously without blocking startup
    this.connectAsync();
  }

  private async connectAsync() {
    try {
      await this.getDataSource();
      this.logger.log('Database connected successfully');
    } catch (error) {
      const errorMsg = error instanceof Error 
        ? `${error.name}: ${error.message}\n${error.stack}` 
        : String(error);
      this.logger.warn(
        `Database connection failed: ${errorMsg.substring(0, 200)} (Attempt ${this.connectionAttempts + 1}/${this.maxRetries})`,
      );
      if (this.connectionAttempts < this.maxRetries) {
        this.connectionAttempts++;
        setTimeout(() => this.connectAsync(), 5000);
      } else {
        this.logger.error(`Max database connection retries reached. Last error: ${errorMsg.substring(0, 300)}`);
      }
    }
  }

  async getDataSource(): Promise<DataSource> {
    if (this.dataSource?.isInitialized) {
      return this.dataSource;
    }

    // Prefer individual connection params
    const host = this.configService.get('DB_HOST') || 'localhost';
    const port = parseInt(this.configService.get('DB_PORT', '5432'));
    const username = this.configService.get('DB_USERNAME', 'postgres');
    const password = this.configService.get('DB_PASSWORD');
    const database = this.configService.get('DB_NAME', 'railway');

    const options: any = {
      type: 'postgres',
      host,
      port,
      username,
      password,
      database,
      entities: [Usuario, Dispositivo, Medicion, Alerta],
      synchronize: false,
      logging: false,
      ssl: false,
      // Connection pool settings
      maxConnections: 5,
      connectionTimeoutMillis: 30000,
      idleTimeoutMillis: 30000,
      max: 5,
      // Statement timeouts
      statement_timeout: 30000,
      application_name: 'solar_generator_backend',
    };

    this.dataSource = new DataSource(options);
    await this.dataSource.initialize();
    return this.dataSource;
  }

  async isConnected(): Promise<boolean> {
    try {
      const ds = await this.getDataSource();
      return ds.isInitialized;
    } catch {
      return false;
    }
  }
}
