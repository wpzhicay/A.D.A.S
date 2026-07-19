import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { ConnectionString } from 'pg-connection-string';
import { DatabaseService } from './database.service';
import { Usuario } from './entities/usuario.entity';
import { Dispositivo } from './entities/dispositivo.entity';
import { Medicion } from './entities/medicion.entity';
import { Alerta } from './entities/alerta.entity';

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

        if (databaseUrl) {
          // Parse DATABASE_URL from production environment
          const connectionString = new ConnectionString(databaseUrl);
          config = {
            ...config,
            host: connectionString.host,
            port: connectionString.port ? parseInt(connectionString.port) : 5432,
            username: connectionString.user,
            password: connectionString.password,
            database: connectionString.database,
          };
        } else {
          // Use individual env variables for development
          config = {
            ...config,
            host: configService.get('DB_HOST') || 'localhost',
            port: parseInt(configService.get('DB_PORT', '5432')),
            username: configService.get('DB_USERNAME', 'postgres'),
            password: configService.get('DB_PASSWORD'),
            database: configService.get('DB_NAME', 'railway'),
          };
        }

        return config;
      },
      inject: [ConfigService],
    }),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
