import { IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMedicionDto {

  @IsNumber()
  voltaje: number;

  @IsNumber()
  corriente: number;

  @IsNumber()
  potencia: number;

  @IsNumber()
  temperatura: number;

  @IsNumber()
  @Type(() => Number)
  porcentajeBateria: number;

  @IsNumber()
  @Type(() => Number)
  idDispositivo: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  latitud?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  longitud?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  velocidad?: number;

  @IsOptional()
  @Type(() => Date)
  fecha?: Date;

}