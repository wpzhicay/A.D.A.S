import { Module, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { ConnectionString } from 'pg-connection-string';
import { DatabaseService } from './database.service';
import { Usuario } from './entities/usuario.entity';
import { Dispositivo } from './entities/dispositivo.entity';
import { Medicion } from './entities/medicion.entity';
import { Alerta } from './entities/alerta.entity';

const logger = new Logger('DatabaseModule');

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get('DATABASE_URL');
        
        let config: any = {
          type: 'postgres',
          entities: [Usuario, Dispositivo, Medicion, Alerta],
          synchronize: false,
          logging: false,
          ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
          extra: {
            max: 3,
            idleTimeoutMillis: 60000,
            connectionTimeoutMillis: 60000,
          },
        };

        try {
          if (databaseUrl) {
            // Parse DATABASE_URL from production environment
            logger.log('🔧 Parsing DATABASE_URL for production environment');
            const connectionString = new ConnectionString(databaseUrl);
            config = {
              ...config,
              host: connectionString.host,
              port: connectionString.port ? parseInt(connectionString.port) : 5432,
              username: connectionString.user,
              password: connectionString.password,
              database: connectionString.database,
            };
            logger.log(`✓ Database config: ${config.host}:${config.port}/${config.database}`);
          } else {
            // Use individual env variables for development
            logger.log('🔧 Using individual DB environment variables');
            config = {
              ...config,
              host: configService.get('DB_HOST') || 'localhost',
              port: parseInt(configService.get('DB_PORT', '5432')),
              username: configService.get('DB_USERNAME', 'postgres'),
              password: configService.get('DB_PASSWORD'),
              database: configService.get('DB_NAME', 'railway'),
            };
            logger.log(`✓ Database config: ${config.host}:${config.port}/${config.database}`);
          }
        } catch (error) {
          logger.error(`❌ Error parsing database configuration: ${error.message}`);
          throw error;
        }

        return config;
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Usuario, Dispositivo, Medicion, Alerta]),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService, TypeOrmModule],
})
export class DatabaseModule {}
