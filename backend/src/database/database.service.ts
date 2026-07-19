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

    const databaseUrl = this.configService.get('DATABASE_URL') || 
                       this.configService.get('DATABASE_PUBLIC_URL');

    const options: any = {
      type: 'postgres',
      entities: [Usuario, Dispositivo, Medicion, Alerta],
      synchronize: false,
      logging: false,
      poolErrorHandler: (error: any) => {
        this.logger.error(`Database pool error: ${error}`);
      },
    };

    // PostgreSQL connection timeout settings
    const postgresOptions = {
      statementTimeout: 30000,
      connectionTimeoutMillis: 30000,
      idleInTransactionSessionTimeout: 30000,
    };

    if (databaseUrl) {
      options.url = databaseUrl;
      options.extra = postgresOptions;
    } else {
      options.host = this.configService.get('DB_HOST', 'localhost');
      options.port = parseInt(this.configService.get('DB_PORT', '5432'));
      options.username = this.configService.get('DB_USERNAME', 'postgres');
      options.password = this.configService.get('DB_PASSWORD');
      options.database = this.configService.get('DB_NAME', 'railway');
      options.extra = postgresOptions;
    }

    // Try without SSL first
    this.dataSource = new DataSource(options);
    try {
      await this.dataSource.initialize();
      return this.dataSource;
    } catch (error) {
      // If connection fails, try with SSL disabled explicitly
      options.ssl = false;
      this.dataSource = new DataSource(options);
      await this.dataSource.initialize();
      return this.dataSource;
    }
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
