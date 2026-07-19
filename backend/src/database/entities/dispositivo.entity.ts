import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Usuario } from './usuario.entity';
import { Medicion } from './medicion.entity';

@Entity('dispositivos')
export class Dispositivo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ unique: true })
  serie: string;

  @Column({ default: 'OFFLINE' })
  estado: string;

  @Column()
  id_usuario: number;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToOne(() => Usuario, (usuario) => usuario.dispositivos)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @OneToMany(() => Medicion, (medicion) => medicion.dispositivo)
  mediciones: Medicion[];
}
