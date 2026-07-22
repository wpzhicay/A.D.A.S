import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Dispositivo } from './dispositivo.entity';

@Entity('mediciones')
export class Medicion {

  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 5, scale: 2 })
  voltaje: number;

  @Column('decimal', { precision: 5, scale: 2 })
  corriente: number;

  @Column('decimal', { precision: 8, scale: 2 })
  potencia: number;

  @Column('decimal', { precision: 5, scale: 2 })
  temperatura: number;

  @Column('decimal', { precision: 5, scale: 2, name: 'porcentaje_bateria' })
  porcentajeBateria: number;

  @Column({ name: 'id_dispositivo' })
  idDispositivo: number;

  // Nuevos campos GPS
  @Column('decimal', { 
    precision: 10, 
    scale: 6, 
    nullable: true 
  })
  latitud: number;

  @Column('decimal', { 
    precision: 10, 
    scale: 6, 
    nullable: true 
  })
  longitud: number;

  @Column('decimal', { 
    precision: 6, 
    scale: 2, 
    nullable: true 
  })
  velocidad: number;

  @Column()
  fecha: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Dispositivo, (dispositivo) => dispositivo.mediciones)
  @JoinColumn({ name: 'id_dispositivo' })
  dispositivo: Dispositivo;
}