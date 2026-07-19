import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { DispositivosModule } from './dispositivos/dispositivos.module';
import { MedicionesModule } from './mediciones/mediciones.module';
import { UbicacionesModule } from './ubicaciones/ubicaciones.module';
import { AlertasModule } from './alertas/alertas.module';
import { ConfiguracionModule } from './configuracion/configuracion.module';
import { Usuario } from './database/entities/usuario.entity';
import { Dispositivo } from './database/entities/dispositivo.entity';
import { Medicion } from './database/entities/medicion.entity';
import { Alerta } from './database/entities/alerta.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL || process.env.DATABASE_PUBLIC_URL,
      host: process.env.DATABASE_URL ? undefined : (process.env.DB_HOST || 'localhost'),
      port: process.env.DATABASE_URL ? undefined : parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DATABASE_URL ? undefined : (process.env.DB_USERNAME || 'postgres'),
      password: process.env.DATABASE_URL ? undefined : (process.env.DB_PASSWORD || 'postgres'),
      database: process.env.DATABASE_URL ? undefined : (process.env.DB_NAME || 'solar_generator'),
      entities: [Usuario, Dispositivo, Medicion, Alerta],
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV === 'development',
      ssl: process.env.DATABASE_URL || process.env.DATABASE_PUBLIC_URL ? { rejectUnauthorized: false } : false,
    }),
    AuthModule,
    UsuariosModule,
    DispositivosModule,
    MedicionesModule,
    UbicacionesModule,
    AlertasModule,
    ConfiguracionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
