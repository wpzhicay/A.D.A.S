import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DispositivosService } from '../../services/dispositivos.service';

@Component({
  selector: 'app-dispositivos',
  templateUrl: './dispositivos.component.html',
  styleUrls: ['./dispositivos.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class DispositivosComponent implements OnInit {
  dispositivos: any[] = [];
  dispositifForm: FormGroup;
  loading = false;
  error: string | null = null;
  mostrarFormulario = false;

  constructor(
    private fb: FormBuilder,
    private dispositivosService: DispositivosService,
  ) {
    this.dispositifForm = this.fb.group({
      nombre: ['', [Validators.required]],
      serie: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.cargarDispositivos();
  }

  cargarDispositivos(): void {
    this.dispositivosService.obtenerDispositivosPublico().subscribe({
      next: (datos) => {
        this.dispositivos = datos;
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al cargar dispositivos';
      },
    });
  }

  agregarDispositivo(): void {
    if (this.dispositifForm.invalid) return;

    if (this.dispositivos.length >= 3) {
      this.error = 'No puedes tener más de 3 dispositivos';
      return;
    }

    this.loading = true;
    this.error = null;

    const { nombre, serie } = this.dispositifForm.value;

    this.dispositivosService.crearDispositivo(nombre, serie).subscribe({
      next: (dispositivo) => {
        this.dispositivos.push(dispositivo);
        this.dispositifForm.reset();
        this.mostrarFormulario = false;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Error al crear dispositivo';
      },
    });
  }

  eliminarDispositivo(id: number): void {
    if (!confirm('¿Estás seguro de que quieres eliminar este dispositivo?')) return;

    this.dispositivosService.eliminarDispositivo(id).subscribe({
      next: () => {
        this.dispositivos = this.dispositivos.filter((d) => d.id !== id);
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al eliminar dispositivo';
      },
    });
  }

  puedeAgregarMas(): boolean {
    return this.dispositivos.length < 3;
  }
}
