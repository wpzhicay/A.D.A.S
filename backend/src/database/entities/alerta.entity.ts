import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Dispositivo } from './dispositivo.entity';

@Entity('alertas')
export class Alerta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tipo: string; // ERROR, ADVERTENCIA, EXITO, INFO

  @Column({ type: 'text', nullable: true })
  mensaje: string;

  @Column()
  id_dispositivo: number;

  @Column()
  fecha: Date;

  @Column({ default: false })
  leida: boolean;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToOne(() => Dispositivo)
  @JoinColumn({ name: 'id_dispositivo' })
  dispositivo: Dispositivo;
}
