import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';

import { MedicionesService } from './mediciones.service';
import { CreateMedicionDto } from './dto/create-medicion.dto';

@Controller('api/mediciones')
export class MedicionesController {

  constructor(
    private readonly medicionesService: MedicionesService,
  ) {}

  @Post()
  create(
    @Body() dto: CreateMedicionDto,
  ) {
    return this.medicionesService.create(dto);
  }


  @Get()
  findAll() {
    return this.medicionesService.findAll();
  }

  @Get('ruta')
  findRuta() {
    return this.medicionesService.findRuta();
  }

  @Get(':id')
  findByDispositivo(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.medicionesService.findByDispositivo(id);
  }
}