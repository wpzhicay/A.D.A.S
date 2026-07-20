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
  
  latitud = 0;
  longitud = 0;
  voltaje = 0;
  bateria = 0;
  velocidad = 0;
  temperatura = 0;
  private updateSubscription!: Subscription;

  constructor(private medicionesService: MedicionesService) {}

  ngAfterViewInit() {
    this.inicializarMapa();
    this.cargarMedicion();
    
    // Actualizar cada 10 segundos
    this.updateSubscription = interval(10000).subscribe(() => {
      this.cargarMedicion();
    });
  }

  ngOnDestroy() {
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
  }

  inicializarMapa() {
    this.map = L.map('map').setView([-2.926469, -78.951933], 15);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(this.map);

    // Crear polyline vacío para la ruta
    this.lineaRuta = L.polyline(this.ruta, {
      color: '#FF6B35',
      weight: 3,
      opacity: 0.8,
      dashArray: '5, 5',
    }).addTo(this.map);

    const icon = L.icon({
      iconUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });

    this.marker = L.marker([-2.926469, -78.951933], { icon })
      .addTo(this.map)
      .bindPopup(this.generarPopup());
  }

  cargarMedicion() {
    this.medicionesService.getMediciones().subscribe({
      next: (data: any[]) => {
        if (data && data.length > 0) {
          const ultima = data[0];
          this.latitud = Number(ultima.latitud) || -2.926469;
          this.longitud = Number(ultima.longitud) || -78.951933;
          this.voltaje = Number(ultima.voltaje) || 0;
          this.bateria = Number(ultima.porcentajeBateria) || 0;
          this.velocidad = Number(ultima.velocidad) || 0;
          this.temperatura = Number(ultima.temperatura) || 0;

          // Agregar nuevo punto a la ruta
          const nuevoPunto: L.LatLngExpression = [this.latitud, this.longitud];
          this.ruta.push(nuevoPunto);
          this.lineaRuta.setLatLngs(this.ruta);

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
      Corriente: ${this.bateria.toFixed(2)} A<br>
      Temperatura: ${this.temperatura.toFixed(2)} °C<br>
      Batería: ${this.bateria.toFixed(0)} %<br>
      Velocidad: ${this.velocidad.toFixed(2)} km/h
    `;
  }
}
