import { Module, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from './database.service';
import { Usuario } from './entities/usuario.entity';
import { Dispositivo } from './entities/dispositivo.entity';
import { Medicion } from './entities/medicion.entity';
import { Alerta } from './entities/alerta.entity';

const logger = new Logger('DatabaseModule');

// Helper function to parse DATABASE_URL
function parseDatabaseUrl(url: string): {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
} {
  try {
    const parsedUrl = new URL(url);
    return {
      host: parsedUrl.hostname || 'localhost',
      port: parsedUrl.port ? parseInt(parsedUrl.port, 10) : 5432,
      username: parsedUrl.username || 'postgres',
      password: parsedUrl.password || '',
      database: (parsedUrl.pathname || '').substring(1), // Remove leading /
    };
  } catch (err) {
    throw new Error(`Failed to parse DATABASE_URL: ${err instanceof Error ? err.message : String(err)}`);
  }
}

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');

        let config: any = {
          type: 'postgres',
          entities: [Usuario, Dispositivo, Medicion, Alerta],
          synchronize: false,
          logging: false,
          ssl:
            process.env.NODE_ENV === 'production'
              ? { rejectUnauthorized: false }
              : false,
          extra: {
            max: 3,
            idleTimeoutMillis: 60000,
            connectionTimeoutMillis: 60000,
          },
        };

        try {
          if (databaseUrl) {
            // Parse DATABASE_URL from production environment
            logger.log(
              '🔧 Parsing DATABASE_URL for production environment',
            );
            const parsed = parseDatabaseUrl(databaseUrl);
            config = {
              ...config,
              host: parsed.host,
              port: parsed.port,
              username: parsed.username,
              password: parsed.password,
              database: parsed.database,
            };
            logger.log(
              `✓ Database config: ${config.host}:${config.port}/${config.database}`,
            );
          } else {
            // Use individual env variables for development
            logger.log(
              '🔧 Using individual DB environment variables',
            );
            config = {
              ...config,
              host: configService.get<string>('DB_HOST') || 'localhost',
              port: parseInt(configService.get<string>('DB_PORT', '5432'), 10),
              username:
                configService.get<string>('DB_USERNAME') || 'postgres',
              password: configService.get<string>('DB_PASSWORD'),
              database: configService.get<string>('DB_NAME') || 'railway',
            };
            logger.log(
              `✓ Database config: ${config.host}:${config.port}/${config.database}`,
            );
          }
        } catch (error) {
          const errorMsg =
            error instanceof Error ? error.message : String(error);
          logger.error(
            `❌ Error parsing database configuration: ${errorMsg}`,
          );
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
