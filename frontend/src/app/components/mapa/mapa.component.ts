import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { MedicionesService } from '../../services/mediciones.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class MapaComponent implements AfterViewInit, OnDestroy {
  map!: L.Map;
  marker!: L.Marker;
  lineaRuta!: L.Polyline;
  ruta: L.LatLngExpression[] = [];
  
  latitud: number = 0;
  longitud: number = 0;
  voltaje: number = 0;
  corriente: number = 0;
  bateria: number = 0;
  velocidad: number = 0;
  temperatura: number = 0;
  private updateSubscription!: Subscription;
  private updateRutaSubscription!: Subscription;

  constructor(private medicionesService: MedicionesService) {
    console.log("🔴 Constructor del MapaComponent");
  }

  ngAfterViewInit() {
    console.log("🟡 ngAfterViewInit iniciado");
    try {
      this.inicializarMapa();
      console.log("✅ Mapa inicializado");
    } catch (error) {
      console.error("❌ Error inicializando mapa:", error);
    }
    
    // Cargar ruta histórica una sola vez al iniciar
    this.cargarRuta();
    
    // Actualizar ruta cada minuto (60000ms)
    this.updateRutaSubscription = interval(60000).subscribe(() => {
      this.cargarRuta();
    });
    
    // Cargar medición actual
    this.cargarMedicion();
    
    // Actualizar medición cada 10 segundos
    this.updateSubscription = interval(10000).subscribe(() => {
      this.cargarMedicion();
    });
  }

  ngOnDestroy() {
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
    if (this.updateRutaSubscription) {
      this.updateRutaSubscription.unsubscribe();
    }
  }

inicializarMapa() {
  console.log("Entró a inicializarMapa");

  this.map = L.map('map').setView([-2.926469, -78.951933], 15);

  console.log("Mapa creado");

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors',
  }).addTo(this.map);

  console.log("Tiles cargados");

    // Crear polyline vacío para la ruta
    this.lineaRuta = L.polyline(this.ruta, {
      color: '#FF6B35',
      weight: 3,
      opacity: 0.8,
      dashArray: '5, 5',
    }).addTo(this.map);

    // Usar marcador por defecto de Leaflet (sin cargar imágenes externas)
    this.marker = L.marker([-2.926469, -78.951933])
      .addTo(this.map)
      .bindPopup(this.generarPopup());
    
    console.log("Marcador creado");
  }

  cargarRuta() {
    this.medicionesService.getMedicionRuta().subscribe({
      next: (data: any[]) => {
        if (data && data.length > 0) {
          // Convertir datos del API a coordenadas Leaflet
          this.ruta = data.map((p) => [
            Number(p.latitud),
            Number(p.longitud),
          ]);
          // Actualizar polyline con todos los puntos históricos
          this.lineaRuta.setLatLngs(this.ruta);
        }
      },
      error: (error) => {
        console.error('Error cargando ruta:', error);
      },
    });
  }

  cargarMedicion() {
    this.medicionesService.getMediciones().subscribe({
      next: (data: any[]) => {
        if (data && data.length > 0) {
          const ultima = data[0];
          this.latitud = this.toNumber(ultima.latitud, -2.926469);
          this.longitud = this.toNumber(ultima.longitud, -78.951933);
          this.voltaje = this.toNumber(ultima.voltaje, 0);
          this.corriente = this.toNumber(ultima.corriente, 0);
          this.bateria = this.toNumber(ultima.porcentaje_bateria, 0);
          this.velocidad = this.toNumber(ultima.velocidad, 0);
          this.temperatura = this.toNumber(ultima.temperatura, 0);

          this.actualizarMarcador();
        }
      },
      error: (error) => {
        console.error('Error cargando mediciones:', error);
      },
    });
  }

  actualizarMarcador() {
    const nuevaPosicion: L.LatLngExpression = [this.latitud, this.longitud];
    this.marker.setLatLng(nuevaPosicion);
    this.map.panTo(nuevaPosicion);
    this.marker.setPopupContent(this.generarPopup());
  }

  generarPopup(): string {
    return `
      <b>☀️ ESP32 Solar</b><br>
      Voltaje: ${this.voltaje.toFixed(2)} V<br>
      Corriente: ${this.corriente.toFixed(2)} A<br>
      Temperatura: ${this.temperatura.toFixed(2)} °C<br>
      Batería: ${this.bateria.toFixed(0)} %<br>
      Velocidad: ${this.velocidad.toFixed(2)} km/h
    `;
  }

  private toNumber(value: any, defaultValue: number): number {
    const num = Number(value);
    return isNaN(num) ? defaultValue : num;
  }
}
