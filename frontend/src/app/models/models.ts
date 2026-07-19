export interface Usuario {
  id?: number;
  nombre: string;
  correo: string;
  password?: string;
}

export interface Dispositivo {
  id?: number;
  nombre: string;
  serie: string;
  estado: string;
}

export interface Medicion {
  id?: number;
  voltaje: number;
  corriente: number;
  potencia: number;
  temperatura: number;
  porcentajeBateria: number;
  fecha: Date;
  idDispositivo: number;
}

export interface Ubicacion {
  id?: number;
  latitud: number;
  longitud: number;
  fecha: Date;
  idDispositivo: number;
}

export interface Alerta {
  id?: number;
  tipo: string;
  mensaje: string;
  fecha: Date;
  idDispositivo: number;
  leida: boolean;
}

export interface Configuracion {
  id?: number;
  nombreDispositivo: string;
  intervaloEnvio: number;
  idDispositivo: number;
}

export interface Dashboard {
  voltajeBateria: number;
  corriente: number;
  potencia: number;
  energiaGenerada: number;
  estadoInversor: string;
  temperatura: number;
  ubicacion: {
    latitud: number;
    longitud: number;
  };
}
