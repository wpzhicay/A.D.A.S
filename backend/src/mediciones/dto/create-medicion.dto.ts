import { IsNumber, IsOptional } from 'class-validator';

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
  @IsNumber()
  latitud?: number;


  @IsOptional()
  @IsNumber()
  longitud?: number;


  @IsOptional()
  @IsNumber()
  velocidad?: number;


  fecha: Date;

}