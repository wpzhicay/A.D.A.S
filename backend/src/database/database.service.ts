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
      this.logger.log('✅ Database connected successfully');
    } catch (error) {
      const errorMsg = error instanceof Error 
        ? `${error.name}: ${error.message}` 
        : String(error);
      
      this.logger.warn(
        `⚠️ Database connection failed: ${errorMsg.substring(0, 100)} (Attempt ${this.connectionAttempts + 1}/${this.maxRetries})`,
      );
      
      if (this.connectionAttempts < this.maxRetries) {
        this.connectionAttempts++;
        // Exponential backoff: 5s, 10s, 15s, 20s, 25s
        const delayMs = 5000 * this.connectionAttempts;
        this.logger.log(`⏳ Retrying in ${delayMs}ms...`);
        setTimeout(() => this.connectAsync(), delayMs);
      } else {
        this.logger.error(`❌ Max database connection retries reached. Last error: ${errorMsg.substring(0, 200)}`);
      }
    }
  }

  async getDataSource(): Promise<DataSource> {
    if (this.dataSource?.isInitialized) {
      return this.dataSource;
    }

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
      ssl: true,
      // Pool configuration
      maxConnections: 3,
      connectionTimeoutMillis: 60000,
      idleTimeoutMillis: 60000,
      max: 3,
      // TCP Keepalive and timeout settings
      keepAlives: true,
      keepAliveInitialDelaySeconds: 30,
      statement_timeout: 60000,
      idle_in_transaction_session_timeout: 60000,
      tcp_keepalives: 1,
      tcp_keepalives_idle: 30,
      tcp_keepalives_interval: 10,
      tcp_keepalives_count: 5,
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
