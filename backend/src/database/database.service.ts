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
      this.logger.warn(`Database connection failed, retrying... Attempt ${this.connectionAttempts + 1}/${this.maxRetries}`);
      if (this.connectionAttempts < this.maxRetries) {
        this.connectionAttempts++;
        setTimeout(() => this.connectAsync(), 5000);
      } else {
        this.logger.error('Max database connection retries reached');
      }
    }
  }

  async getDataSource(): Promise<DataSource> {
    if (this.dataSource?.isInitialized) {
      return this.dataSource;
    }

    const databaseUrl = this.configService.get('DATABASE_URL') || 
                       this.configService.get('DATABASE_PUBLIC_URL');

    const options: any = {
      type: 'postgres',
      entities: [Usuario, Dispositivo, Medicion, Alerta],
      synchronize: false,
      logging: false,
      ssl: false,
    };

    if (databaseUrl) {
      options.url = databaseUrl;
    } else {
      options.host = this.configService.get('DB_HOST', 'localhost');
      options.port = parseInt(this.configService.get('DB_PORT', '5432'));
      options.username = this.configService.get('DB_USERNAME', 'postgres');
      options.password = this.configService.get('DB_PASSWORD');
      options.database = this.configService.get('DB_NAME', 'railway');
    }

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
