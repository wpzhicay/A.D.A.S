import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Medicion } from '../database/entities/medicion.entity';
import { Dispositivo } from '../database/entities/dispositivo.entity';

import { MedicionesController } from './mediciones.controller';
import { MedicionesService } from './mediciones.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Medicion,
      Dispositivo,
    ]),
  ],
  controllers: [
    MedicionesController,
  ],
  providers: [
    MedicionesService,
  ],
})
export class MedicionesModule {}