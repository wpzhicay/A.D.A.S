import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Medicion, Dashboard, Ubicacion, Alerta } from '../models/models';
import { environment } from '@environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Login
  login(correo: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { correo, password });
  }

  // Mediciones
  getMediciones(idDispositivo: number): Observable<Medicion[]> {
    return this.http.get<Medicion[]>(`${this.apiUrl}/mediciones?idDispositivo=${idDispositivo}`);
  }

  postMedicion(medicion: Medicion): Observable<Medicion> {
    return this.http.post<Medicion>(`${this.apiUrl}/mediciones`, medicion);
  }

  // Dashboard
  getDashboard(idDispositivo: number): Observable<Dashboard> {
    return this.http.get<Dashboard>(`${this.apiUrl}/dashboard?idDispositivo=${idDispositivo}`);
  }

  // GPS / Ubicaciones
  getUbicaciones(idDispositivo: number): Observable<Ubicacion[]> {
    return this.http.get<Ubicacion[]>(`${this.apiUrl}/gps?idDispositivo=${idDispositivo}`);
  }

  // Alertas
  getAlertas(idDispositivo: number): Observable<Alerta[]> {
    return this.http.get<Alerta[]>(`${this.apiUrl}/alertas?idDispositivo=${idDispositivo}`);
  }
}
