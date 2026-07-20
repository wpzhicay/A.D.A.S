import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MedicionesService } from './mediciones.service';
import { CreateMedicionDto } from './dto/create-medicion.dto';

@Controller('api/mediciones')
@UseGuards(JwtAuthGuard)
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

  @Get(':id')
  findByDispositivo(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.medicionesService.findByDispositivo(id);
  }
}