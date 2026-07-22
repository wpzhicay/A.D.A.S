import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, interval, of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { environment } from '@environments/environment';

export interface Medicion {
  id?: number;
  voltaje: number;
  corriente: number;
  potencia: number;
  temperatura: number;
  porcentajeBateria: number;
  idDispositivo: number;
  latitud: number;
  longitud: number;
  velocidad: number;
  fecha: Date;
  estado?: string;
}

interface MedicionApi {
  id: number;
  voltaje: string | number;
  corriente: string | number;
  potencia: string | number;
  temperatura: string | number;
  porcentaje_bateria: string | number;
  id_dispositivo: number;
  latitud: string | number;
  longitud: string | number;
  velocidad: string | number;
  fecha: string;
  dispositivo?: {
    id: number;
    nombre: string;
    serie: string;
    estado: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class MedicionesService {
  private apiUrl = `${environment.apiUrl}/mediciones`;
  private selectedDeviceId$ = new BehaviorSubject<number>(1);

  constructor(private http: HttpClient) {}

  private convertirMedicion(medicion: MedicionApi): Medicion {
    return {
      id: medicion.id,
      voltaje: Number(medicion.voltaje) || 0,
      corriente: Number(medicion.corriente) || 0,
      potencia: Number(medicion.potencia) || 0,
      temperatura: Number(medicion.temperatura) || 0,
      porcentajeBateria: Number(medicion.porcentaje_bateria) || 0,
      idDispositivo: Number(medicion.id_dispositivo) || 0,
      latitud: Number(medicion.latitud) || 0,
      longitud: Number(medicion.longitud) || 0,
      velocidad: Number(medicion.velocidad) || 0,
      fecha: new Date(medicion.fecha),
      estado: medicion.dispositivo?.estado ?? 'OFFLINE',
    };
  }

  obtenerUltimaMedicion(idDispositivo: number): Observable<Medicion> {
    return this.http.get<MedicionApi[]>(this.apiUrl).pipe(
      map((mediciones) => {
        const medicionesDispositivo = mediciones.filter(
          (medicion) =>
            Number(medicion.id_dispositivo) === Number(idDispositivo),
        );

        if (medicionesDispositivo.length === 0) {
          throw new Error('No existen mediciones para este dispositivo');
        }

        // La API ya devuelve el registro más reciente primero.
        return this.convertirMedicion(medicionesDispositivo[0]);
      }),
    );
  }

  obtenerMediciones24h(idDispositivo: number): Observable<Medicion[]> {
    const hace24Horas = new Date();
    hace24Horas.setHours(hace24Horas.getHours() - 24);

    return this.http.get<MedicionApi[]>(this.apiUrl).pipe(
      map((mediciones) =>
        mediciones
          .filter(
            (medicion) =>
              Number(medicion.id_dispositivo) === Number(idDispositivo) &&
              new Date(medicion.fecha) >= hace24Horas,
          )
          .map((medicion) => this.convertirMedicion(medicion)),
      ),
    );
  }

  obtenerMedicionesEnTiempoReal(
    idDispositivo: number,
  ): Observable<Medicion> {
    return interval(5000).pipe(
      startWith(0),
      switchMap(() => this.obtenerUltimaMedicion(idDispositivo)),
      catchError((error) => {
        console.error('Error obteniendo mediciones:', error);

        return of({
          voltaje: 0,
          corriente: 0,
          potencia: 0,
          temperatura: 0,
          porcentajeBateria: 0,
          idDispositivo,
          latitud: 0,
          longitud: 0,
          velocidad: 0,
          fecha: new Date(),
          estado: 'OFFLINE',
        });
      }),
    );
  }

  setSelectedDevice(idDispositivo: number): void {
    this.selectedDeviceId$.next(idDispositivo);
  }

  getSelectedDevice$(): Observable<number> {
    return this.selectedDeviceId$.asObservable();
  }

  getMediciones(): Observable<Medicion[]> {
    return this.http.get<MedicionApi[]>(this.apiUrl).pipe(
      map((mediciones) =>
        mediciones.map((medicion) => this.convertirMedicion(medicion)),
      ),
    );
  }

  getMedicionPorDispositivo(
    idDispositivo: number,
  ): Observable<Medicion[]> {
    return this.http
      .get<MedicionApi[]>(`${this.apiUrl}/${idDispositivo}`)
      .pipe(
        map((mediciones) =>
          mediciones.map((medicion) => this.convertirMedicion(medicion)),
        ),
      );
  }

  getMedicionRuta(): Observable<Medicion[]> {
    return this.http.get<MedicionApi[]>(`${this.apiUrl}/ruta`).pipe(
      map((mediciones) =>
        mediciones.map((medicion) => this.convertirMedicion(medicion)),
      ),
    );
  }
}