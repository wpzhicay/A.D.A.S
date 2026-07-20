import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MedicionesService, Medicion } from '../../services/mediciones.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';

interface ContactoEmergencia {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  estado: 'en_linea' | 'offline';
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, NgChartsModule],
})
export class DashboardComponent implements OnInit, OnDestroy {
  selectedDeviceId: number = 1;
  ultimaMedicion: Medicion | null = null;
  mediciones24h: Medicion[] = [];
  loading = true;
  usuarioActual: any = null;
  contactosEmergencia: ContactoEmergencia[] = [];
  private destroy$ = new Subject<void>();

  // Data para gráficos
  converterChartData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };
  performanceChartData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };
  wristPowerChartData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };

  converterChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    indexAxis: 'y',
    scales: {
      x: { stacked: true },
      y: { stacked: true },
    },
  };

  performanceChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: true },
    },
  };

  wristPowerChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: true,
  };

  constructor(
    private medicionesService: MedicionesService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.cargarUsuarioActual();
    this.cargarMediciones();
    this.cargarContactosEmergencia();
    this.suscribirMedicionesTiempoReal();
  }

  cargarUsuarioActual(): void {
    // Cargar datos del usuario del localStorage
    const usuarioStr = localStorage.getItem('usuario');
    if (usuarioStr) {
      try {
        this.usuarioActual = JSON.parse(usuarioStr);
      } catch (e) {
        this.usuarioActual = { nombre: 'Usuario', correo: 'correo@email.com' };
      }
    } else {
      // Datos por defecto para demo
      this.usuarioActual = { nombre: 'Juan Pérez', correo: 'juan@example.com' };
    }
  }



  cargarMediciones(): void {
    this.medicionesService.obtenerMediciones24h(this.selectedDeviceId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (mediciones) => {
        this.mediciones24h = mediciones;
        this.generarGraficos();
        this.loading = false;
      },
    });
  }

  suscribirMedicionesTiempoReal(): void {
    this.medicionesService
      .obtenerMedicionesEnTiempoReal(this.selectedDeviceId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (medicion) => {
          this.ultimaMedicion = medicion;
        },
      });
  }

  generarGraficos(): void {
    // Gráfico 1: Converter (Stacked Bar Chart)
    this.converterChartData = {
      labels: this.mediciones24h.map((m) => new Date(m.fecha).toLocaleTimeString()),
      datasets: [
        {
          label: 'Voltaje',
          data: this.mediciones24h.map((m) => m.voltaje * 2),
          backgroundColor: '#FF6B35',
        },
        {
          label: 'Corriente',
          data: this.mediciones24h.map((m) => m.corriente * 5),
          backgroundColor: '#F7931E',
        },
        {
          label: 'Potencia',
          data: this.mediciones24h.map((m) => m.potencia / 2),
          backgroundColor: '#FDB913',
        },
      ],
    };

    // Gráfico 2: Performance (Line Chart)
    this.performanceChartData = {
      labels: this.mediciones24h.map((m) => new Date(m.fecha).getHours() + ':00'),
      datasets: [
        {
          label: 'Potencia (W)',
          data: this.mediciones24h.map((m) => m.potencia),
          borderColor: '#667EEA',
          backgroundColor: 'rgba(102, 126, 234, 0.1)',
          tension: 0.4,
          fill: true,
        },
        {
          label: 'Temperatura (°C)',
          data: this.mediciones24h.map((m) => m.temperatura * 2),
          borderColor: '#F093FB',
          backgroundColor: 'rgba(240, 147, 251, 0.1)',
          tension: 0.4,
          fill: true,
        },
      ],
    };

    // Gráfico 3: Wrist Power (Bar Chart)
    const horas = ['00:00', '06:00', '12:00', '18:00'];
    this.wristPowerChartData = {
      labels: horas,
      datasets: [
        {
          label: 'Energía Generada (kWh)',
          data: [12, 19, 35, 15],
          backgroundColor: ['#667EEA', '#764BA2', '#F093FB', '#4FACFE'],
        },
      ],
    };
  }

  getDispositivoNombre(): string {
    return 'Panel Solar';
  }

  getEstadoColor(): string {
    return this.ultimaMedicion?.voltaje ?? 0 > 11 ? 'online' : 'offline';
  }

  // Métodos de navegación y acciones
  verDetalleMetrica(metrica: string): void {
    console.log('Ver detalle de:', metrica);
    // Aquí puedes agregar lógica para mostrar un modal o navegación
  }

  irAHistorial(): void {
    this.router.navigate(['/historial']);
  }

  irAMapa(): void {
    this.router.navigate(['/mapa']);
  }

  irAAlertas(): void {
    this.router.navigate(['/alertas']);
  }

  irAConfiguracion(): void {
    this.router.navigate(['/configuracion']);
  }

  irAuditoria(): void {
    this.router.navigate(['/auditoria']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  latitud: number | null = null;
  longitud: number | null = null;
  auxilioEnviado = false;

  obtenerCoordenadas(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.latitud = position.coords.latitude;
          this.longitud = position.coords.longitude;
        },
        (error) => {
          console.log('Error al obtener ubicación:', error);
          // Coordenadas por defecto (Ecuador)
          this.latitud = -2.903;
          this.longitud = -79.005;
        }
      );
    }
  }

  enviarAuxilio(): void {
    this.obtenerCoordenadas();
    
    // Obtener contactos de emergencia del localStorage
    const registroStr = localStorage.getItem('registroData');
    let contactosEmergencia: any[] = [];
    
    if (registroStr) {
      try {
        const registroData = JSON.parse(registroStr);
        if (registroData.contactosEmergencia?.contactos) {
          contactosEmergencia = registroData.contactosEmergencia.contactos;
        }
      } catch (e) {
        console.log('Error al obtener contactos:', e);
      }
    }
    
    const mensaje = `🚨 SOLICITUD DE AUXILIO 🚨

Ubicación GPS:
Latitud: ${this.latitud}
Longitud: ${this.longitud}

Usuario: ${this.usuarioActual?.nombre || 'Usuario'}
Dispositivo: ${this.getDispositivoNombre()}
Hora: ${new Date().toLocaleString()}`;
    
    // Enviar a cada contacto de emergencia
    if (contactosEmergencia.length > 0) {
      contactosEmergencia.forEach((contacto) => {
        console.log(`Enviando auxilio a ${contacto.nombre} (${contacto.correo}):`, mensaje);
        // Aquí iría la integración con backend para enviar email/SMS
      });
    }
    
    console.log('Mensaje de auxilio:', mensaje);
    
    // Mostrar confirmación
    this.auxilioEnviado = true;
    
    // Ocultar el mensaje después de 3 segundos
    setTimeout(() => {
      this.auxilioEnviado = false;
    }, 3000);
  }

  cargarContactosEmergencia(): void {
    // Datos de ejemplo - En producción, esto vendría del backend
    this.contactosEmergencia = [
      {
        id: 1,
        nombre: 'Carlos Rodríguez',
        email: 'carlos.rodriguez@email.com',
        telefono: '+593 98765432',
        estado: 'en_linea'
      },
      {
        id: 2,
        nombre: 'María García',
        email: 'maria.garcia@email.com',
        telefono: '+593 99876543',
        estado: 'en_linea'
      },
      {
        id: 3,
        nombre: 'Juan Martínez',
        email: 'juan.martinez@email.com',
        telefono: '+593 98765433',
        estado: 'offline'
      }
    ];
  }

  getInitials(nombre: string): string {
    return nombre
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  }
}

