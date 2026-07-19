import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment.prod';

export interface Dispositivo {
  id?: number;
  nombre: string;
  serie: string;
  estado?: string;
}

@Injectable({
  providedIn: 'root',
})
export class DispositivosService {
  private apiUrl = `${environment.apiUrl}/dispositivos`;

  constructor(private http: HttpClient) {}

  crearDispositivo(nombre: string, serie: string): Observable<Dispositivo> {
    return this.http.post<Dispositivo>(this.apiUrl, { nombre, serie });
  }

  obtenerDispositivos(): Observable<Dispositivo[]> {
    return this.http.get<Dispositivo[]>(this.apiUrl);
  }

  obtenerDispositivo(id: number): Observable<Dispositivo> {
    return this.http.get<Dispositivo>(`${this.apiUrl}/${id}`);
  }

  eliminarDispositivo(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
