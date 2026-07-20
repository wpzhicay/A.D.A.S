import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { MedicionesService } from '../../services/mediciones.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.scss'],
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
})
export class HistorialComponent implements AfterViewInit, OnDestroy {
  // Datos para los gráficos
  voltajeData: any[] = [];
  corrienteData: any[] = [];
  temperaturaData: any[] = [];
  bateriaData: any[] = [];
  labels: string[] = [];

  // Configuración de gráficos
  voltajeChartConfig: ChartConfiguration = this.getChartConfig('Voltaje (V)', '#007bff');
  corrienteChartConfig: ChartConfiguration = this.getChartConfig('Corriente (A)', '#28a745');
  temperaturaChartConfig: ChartConfiguration = this.getChartConfig(
    'Temperatura (°C)',
    '#dc3545'
  );
  bateriaChartConfig: ChartConfiguration = this.getChartConfig('Batería (%)', '#ffc107');

  private updateSubscription!: Subscription;

  constructor(private medicionesService: MedicionesService) {}

  ngAfterViewInit() {
    this.cargarMediciones();

    // Actualizar gráficos cada 30 segundos
    this.updateSubscription = interval(30000).subscribe(() => {
      this.cargarMediciones();
    });
  }

  ngOnDestroy() {
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
  }

  cargarMediciones() {
    this.medicionesService.getMediciones().subscribe({
      next: (data: any[]) => {
        if (data && data.length > 0) {
          // Ordenar por fecha ascendente (más antiguo primero)
          const sorted = [...data].sort(
            (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
          );

          // Tomar últimas 24 mediciones
          const last24 = sorted.slice(-24);

          // Generar labels (horas)
          this.labels = last24.map((m) => {
            const date = new Date(m.fecha);
            return date.toLocaleTimeString('es-ES', {
              hour: '2-digit',
              minute: '2-digit',
            });
          });

          // Extraer datos
          const voltajes = last24.map((m) => Number(m.voltaje) || 0);
          const corrientes = last24.map((m) => Number(m.voltaje) || 0); // En tu DTO usa corriente si existe
          const temperaturas = last24.map((m) => Number(m.temperatura) || 0);
          const baterias = last24.map((m) => Number(m.porcentajeBateria) || 0);

          // Actualizar configuraciones
          this.voltajeChartConfig.data.labels = this.labels;
          this.voltajeChartConfig.data.datasets[0].data = voltajes;

          this.corrienteChartConfig.data.labels = this.labels;
          this.corrienteChartConfig.data.datasets[0].data = corrientes;

          this.temperaturaChartConfig.data.labels = this.labels;
          this.temperaturaChartConfig.data.datasets[0].data = temperaturas;

          this.bateriaChartConfig.data.labels = this.labels;
          this.bateriaChartConfig.data.datasets[0].data = baterias;

          // Forzar actualización de Chart.js
          if (this.voltajeChartConfig && this.voltajeChartConfig.data) {
            // Trigger change detection
            this.voltajeChartConfig = { ...this.voltajeChartConfig };
            this.corrienteChartConfig = { ...this.corrienteChartConfig };
            this.temperaturaChartConfig = { ...this.temperaturaChartConfig };
            this.bateriaChartConfig = { ...this.bateriaChartConfig };
          }
        }
      },
      error: (error) => {
        console.error('Error cargando mediciones:', error);
      },
    });
  }

  private getChartConfig(label: string, borderColor: string): ChartConfiguration {
    return {
      type: 'line',
      data: {
        labels: this.labels,
        datasets: [
          {
            label: label,
            data: [],
            borderColor: borderColor,
            backgroundColor: borderColor + '20', // Transparencia
            fill: true,
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 4,
            pointBackgroundColor: borderColor,
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              font: { size: 12 },
              padding: 15,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)',
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
      },
    };
  }
}
