import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface AuditLog {
  id: number;
  timestamp: string;
  usuario: string;
  accion: string;
  dispositivo: string;
  estado: 'success' | 'warning' | 'error' | 'info';
  detalles: string;
}

@Component({
  selector: 'app-auditoria',
  templateUrl: './auditoria.component.html',
  styleUrls: ['./auditoria.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class AuditoriaComponent implements OnInit {
  auditLogs: AuditLog[] = [];
  filteredLogs: AuditLog[] = [];
  
  filtroAccion = '';
  filtroEstado = '';
  filtroFecha = '';
  
  selectedLog: AuditLog | null = null;
  showDetails = false;

  estadisticas = {
    totalAcciones: 0,
    accionesExitosas: 0,
    advertencias: 0,
    errores: 0,
  };

  ngOnInit(): void {
    this.cargarLogs();
    this.calcularEstadisticas();
  }

  cargarLogs(): void {
    this.auditLogs = [
      {
        id: 1,
        timestamp: '2026-07-19 10:30:00',
        usuario: 'admin@solar.com',
        accion: 'Login',
        dispositivo: 'Panel Solar #1',
        estado: 'success',
        detalles: 'Usuario inició sesión exitosamente',
      },
      {
        id: 2,
        timestamp: '2026-07-19 10:35:15',
        usuario: 'admin@solar.com',
        accion: 'Cambio de Configuración',
        dispositivo: 'Panel Solar #1',
        estado: 'success',
        detalles: 'Voltaje máximo ajustado a 48V',
      },
      {
        id: 3,
        timestamp: '2026-07-19 10:40:22',
        usuario: 'tech@solar.com',
        accion: 'Lectura de Datos',
        dispositivo: 'Panel Solar #2',
        estado: 'info',
        detalles: 'Acceso a datos de mediciones últimas 24h',
      },
      {
        id: 4,
        timestamp: '2026-07-19 10:45:30',
        usuario: 'admin@solar.com',
        accion: 'Reinicio de Dispositivo',
        dispositivo: 'Panel Solar #1',
        estado: 'warning',
        detalles: 'Reinicio por actualización de firmware',
      },
      {
        id: 5,
        timestamp: '2026-07-19 10:50:45',
        usuario: 'monitor@solar.com',
        accion: 'Alerta Generada',
        dispositivo: 'Panel Solar #3',
        estado: 'error',
        detalles: 'Temperatura crítica detectada: 65°C',
      },
    ];

    this.filteredLogs = [...this.auditLogs];
  }

  calcularEstadisticas(): void {
    this.estadisticas.totalAcciones = this.auditLogs.length;
    this.estadisticas.accionesExitosas = this.auditLogs.filter(
      (log) => log.estado === 'success'
    ).length;
    this.estadisticas.advertencias = this.auditLogs.filter(
      (log) => log.estado === 'warning'
    ).length;
    this.estadisticas.errores = this.auditLogs.filter(
      (log) => log.estado === 'error'
    ).length;
  }

  aplicarFiltros(): void {
    this.filteredLogs = this.auditLogs.filter((log) => {
      const matchAccion =
        !this.filtroAccion ||
        log.accion
          .toLowerCase()
          .includes(this.filtroAccion.toLowerCase());
      const matchEstado = !this.filtroEstado || log.estado === this.filtroEstado;
      const matchFecha =
        !this.filtroFecha ||
        log.timestamp.substring(0, 10) === this.filtroFecha;

      return matchAccion && matchEstado && matchFecha;
    });
  }

  verDetalles(log: AuditLog): void {
    this.selectedLog = log;
    this.showDetails = true;
  }

  cerrarDetalles(): void {
    this.showDetails = false;
    this.selectedLog = null;
  }

  descargarReporte(): void {
    const contenido = this.generarReportePDF();
    const elemento = document.createElement('a');
    elemento.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(contenido)
    );
    elemento.setAttribute('download', `reporte-auditoria-${new Date().toISOString().split('T')[0]}.txt`);
    elemento.style.display = 'none';
    document.body.appendChild(elemento);
    elemento.click();
    document.body.removeChild(elemento);
  }

  generarReportePDF(): string {
    let reporte = '╔════════════════════════════════════════════════════════════╗\n';
    reporte += '║              REPORTE DE AUDITORÍA - A.D.A. SOLAR           ║\n';
    reporte += '╚════════════════════════════════════════════════════════════╝\n\n';

    reporte += `Fecha de Generación: ${new Date().toLocaleString()}\n\n`;

    reporte += '┌─ ESTADÍSTICAS ─────────────────────────────────────────────┐\n';
    reporte += `│ Total de Acciones: ${this.estadisticas.totalAcciones}\n`;
    reporte += `│ Exitosas: ${this.estadisticas.accionesExitosas} | Advertencias: ${this.estadisticas.advertencias} | Errores: ${this.estadisticas.errores}\n`;
    reporte += '└────────────────────────────────────────────────────────────┘\n\n';

    reporte += '┌─ REGISTRO DE AUDITORÍA ────────────────────────────────────┐\n';
    this.filteredLogs.forEach((log) => {
      reporte += `\n  ID: ${log.id}\n`;
      reporte += `  Timestamp: ${log.timestamp}\n`;
      reporte += `  Usuario: ${log.usuario}\n`;
      reporte += `  Acción: ${log.accion}\n`;
      reporte += `  Dispositivo: ${log.dispositivo}\n`;
      reporte += `  Estado: ${log.estado.toUpperCase()}\n`;
      reporte += `  Detalles: ${log.detalles}\n`;
      reporte += '  ─────────────────────────────────────────────────────────\n';
    });
    reporte += '└────────────────────────────────────────────────────────────┘\n';

    return reporte;
  }

  resetearFiltros(): void {
    this.filtroAccion = '';
    this.filtroEstado = '';
    this.filtroFecha = '';
    this.filteredLogs = [...this.auditLogs];
  }

  getEstadoIcon(estado: string): string {
    const iconos: { [key: string]: string } = {
      success: '✓',
      warning: '⚠',
      error: '✕',
      info: 'ℹ',
    };
    return iconos[estado] || '●';
  }

  getEstadoColor(estado: string): string {
    const colores: { [key: string]: string } = {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    };
    return colores[estado] || '#6b7280';
  }
}
