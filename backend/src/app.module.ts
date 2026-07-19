import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthModule } from './health/health.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { DispositivosModule } from './dispositivos/dispositivos.module';
import { MedicionesModule } from './mediciones/mediciones.module';
import { UbicacionesModule } from './ubicaciones/ubicaciones.module';
import { AlertasModule } from './alertas/alertas.module';
import { ConfiguracionModule } from './configuracion/configuracion.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // Try to get database URL from Railway or individual variables
        const databaseUrl = configService.get('DATABASE_URL') || 
                          configService.get('DATABASE_PUBLIC_URL');
        
        if (databaseUrl) {
          return {
            type: 'postgres',
            url: databaseUrl,
            entities: ['dist/database/entities/*.entity.js'],
            synchronize: false,
            logging: true,
            retryAttempts: 3,
            retryDelay: 3000,
            keepConnectionAlive: true,
            ssl: false,
          };
        }
        
        // Fallback to individual environment variables
        return {
          type: 'postgres',
          host: configService.get('DB_HOST', 'localhost'),
          port: parseInt(configService.get('DB_PORT', '5432')),
          username: configService.get('DB_USERNAME', 'postgres'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_NAME', 'railway'),
          entities: ['dist/database/entities/*.entity.js'],
          synchronize: false,
          logging: true,
          retryAttempts: 3,
          retryDelay: 3000,
          keepConnectionAlive: true,
          ssl: false,
        };
      },
    }),
    HealthModule,
    UsuariosModule,
    DispositivosModule,
    MedicionesModule,
    UbicacionesModule,
    AlertasModule,
    ConfiguracionModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
