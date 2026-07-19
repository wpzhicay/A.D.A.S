import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '@environments/environment.prod';

export interface Alerta {
  id?: number;
  tipo: 'ERROR' | 'ADVERTENCIA' | 'EXITO' | 'INFO';
  mensaje: string;
  fecha?: Date;
  idDispositivo: number;
  leida?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AlertasService {
  private apiUrl = environment.apiUrl;
  private alertasSubject = new BehaviorSubject<Alerta[]>([]);
  public alertas$ = this.alertasSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Obtener alertas
  getAlertas(idDispositivo: number): Observable<Alerta[]> {
    return this.http.get<Alerta[]>(`${this.apiUrl}/alertas?idDispositivo=${idDispositivo}`);
  }

  // Crear alerta
  crearAlerta(alerta: Alerta): Observable<Alerta> {
    return this.http.post<Alerta>(`${this.apiUrl}/alertas`, alerta);
  }

  // Marcar como leída
  marcarComoLeida(idAlerta: number): Observable<Alerta> {
    return this.http.patch<Alerta>(`${this.apiUrl}/alertas/${idAlerta}`, { leida: true });
  }

  // Marcar todas como leídas
  marcarTodasComoLeidas(idDispositivo: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/alertas/dispositivo/${idDispositivo}`, { leida: true });
  }

  // Eliminar alerta
  eliminarAlerta(idAlerta: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/alertas/${idAlerta}`);
  }

  // Actualizar alertas locales
  actualizarAlertas(alertas: Alerta[]): void {
    this.alertasSubject.next(alertas);
  }

  // Obtener alertas locales
  getAlertasLocales(): Alerta[] {
    return this.alertasSubject.value;
  }

  // Agregar alerta local
  agregarAlertaLocal(alerta: Alerta): void {
    const alertas = this.alertasSubject.value;
    alertas.push(alerta);
    this.alertasSubject.next(alertas);
  }

  // Contar alertas no leídas
  contarNoLeidas(): number {
    return this.alertasSubject.value.filter((a) => !a.leida).length;
  }
}
