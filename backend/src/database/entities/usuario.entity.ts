import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Dispositivo } from './dispositivo.entity';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ unique: true })
  correo: string;

  @Column()
  password: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @OneToMany(() => Dispositivo, (dispositivo) => dispositivo.usuario)
  dispositivos: Dispositivo[];
}
