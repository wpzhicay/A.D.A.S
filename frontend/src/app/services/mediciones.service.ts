import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, interval } from 'rxjs';
import { switchMap, catchError, startWith } from 'rxjs/operators';
import { of } from 'rxjs';
import { environment } from '@environments/environment';

export interface Medicion {
  id?: number;
  voltaje: number;
  corriente: number;
  potencia: number;
  temperatura: number;
  porcentajeBateria: number;
  idDispositivo: number;
  fecha: Date;
}

export interface DashboardData {
  ultimaMedicion: Medicion;
  mediciones24h: Medicion[];
  estadistica: {
    voltajePromedio: number;
    corrientePromedio: number;
    potenciaMaxima: number;
    temperaturaMcima: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class MedicionesService {
  private apiUrl = `${environment.apiUrl}/mediciones`;
  private selectedDeviceId$ = new BehaviorSubject<number>(1);

  constructor(private http: HttpClient) {}

  // Mock data for development - simulates real-time updates
  private generateMockMedicion(idDispositivo: number): Medicion {
    return {
      voltaje: 12.5 + Math.random() * 2,
      corriente: 1.8 + Math.random() * 1.5,
      potencia: 20 + Math.random() * 10,
      temperatura: 28 + Math.random() * 8,
      porcentajeBateria: 75 + Math.random() * 20,
      idDispositivo,
      fecha: new Date(),
    };
  }

  obtenerUltimaMedicion(idDispositivo: number): Observable<Medicion> {
    // En producción, esto vendría del backend
    return of(this.generateMockMedicion(idDispositivo));
  }

  obtenerMediciones24h(idDispositivo: number): Observable<Medicion[]> {
    // Mock data - genera 24 puntos de datos (uno por hora)
    const mediciones: Medicion[] = [];
    for (let i = 0; i < 24; i++) {
      const date = new Date();
      date.setHours(date.getHours() - (24 - i));
      mediciones.push({
        ...this.generateMockMedicion(idDispositivo),
        fecha: date,
      });
    }
    return of(mediciones);
  }

  // Simula actualizaciones en tiempo real
  obtenerMedicionesEnTiempoReal(idDispositivo: number): Observable<Medicion> {
    return interval(2000).pipe(
      startWith(0),
      switchMap(() => this.obtenerUltimaMedicion(idDispositivo)),
      catchError((error) => {
        console.error('Error obteniendo mediciones:', error);
        return of(this.generateMockMedicion(idDispositivo));
      }),
    );
  }

  setSelectedDevice(idDispositivo: number): void {
    this.selectedDeviceId$.next(idDispositivo);
  }

  getSelectedDevice$(): Observable<number> {
    return this.selectedDeviceId$.asObservable();
  }

  // Método para obtener todas las mediciones del API
  getMediciones(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Método para obtener mediciones por dispositivo
  getMedicionPorDispositivo(idDispositivo: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${idDispositivo}`);
  }

  // Método para obtener solo la ruta GPS (optimizado)
  getMedicionRuta(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ruta`);
  }
}
