import { IsNumber, IsDateString, IsOptional } from 'class-validator';

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
  porcentaje_bateria: number;

  @IsNumber()
  id_dispositivo: number;

  @IsOptional()
  @IsDateString()
  fecha?: Date;
}