import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';

interface ContactoEmergencia {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  estado: 'en_linea' | 'offline';
}

@Component({
  selector: 'app-alertas',
  templateUrl: './alertas.component.html',
  standalone: true,
  imports: [CommonModule],
})
export class AlertasComponent implements OnInit, OnDestroy {
  latitud: number | null = null;
  longitud: number | null = null;
  auxilioEnviado = false;
  contactosEmergencia: ContactoEmergencia[] = [];
  private destroy$ = new Subject<void>();

  constructor() {}

  ngOnInit(): void {
    this.obtenerCoordenadas();
    this.cargarContactosEmergencia();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

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
      },
      {
        id: 4,
        nombre: 'Sofia López',
        email: 'sofia.lopez@email.com',
        telefono: '+593 99876544',
        estado: 'en_linea'
      },
      {
        id: 5,
        nombre: 'Pedro Sánchez',
        email: 'pedro.sanchez@email.com',
        telefono: '+593 98765434',
        estado: 'en_linea'
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

  enviarAuxilio(): void {
    this.obtenerCoordenadas();
    
    const mensaje = `🚨 SOLICITUD DE AUXILIO 🚨\n\nUbicación GPS:\nLatitud: ${this.latitud}\nLongitud: ${this.longitud}\n\nHora: ${new Date().toLocaleString()}`;
    
    // Simular envío del mensaje
    console.log('Mensaje de auxilio enviado:', mensaje);
    
    // Mostrar confirmación
    this.auxilioEnviado = true;
    
    // Ocultar el mensaje después de 3 segundos
    setTimeout(() => {
      this.auxilioEnviado = false;
    }, 3000);
  }
}
