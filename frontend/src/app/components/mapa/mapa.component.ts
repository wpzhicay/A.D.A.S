import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class MapaComponent implements AfterViewInit {
  map!: L.Map;
  marker!: L.Marker;
  latitud = -2.926469;
  longitud = -78.951933;
  velocidad = 0.31;

  ngAfterViewInit() {
    this.map = L.map('map').setView([this.latitud, this.longitud], 15);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
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

    this.marker = L.marker([this.latitud, this.longitud], { icon })
      .addTo(this.map)
      .bindPopup(
        `
        <b>ESP32 Solar</b><br>
        Voltaje: 12.5V<br>
        Batería: 90%<br>
        Velocidad: ${this.velocidad} km/h
      `
      )
      .openPopup();
  }

  updateMarker(lat: number, lon: number) {
    this.latitud = lat;
    this.longitud = lon;
    this.marker.setLatLng([lat, lon]);
    this.map.setView([lat, lon], 15);
  }
}
