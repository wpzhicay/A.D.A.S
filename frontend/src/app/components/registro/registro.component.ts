import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class RegistroComponent {
  registroForm: FormGroup;
  loading = false;
  error: string | null = null;
  success: string | null = null;
  fotoPreview: string | null = null;
  fotoFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmarPassword: ['', [Validators.required]],
      foto: [''],
      terminosCondiciones: [false, [Validators.requiredTrue]],
      contactosEmergencia: this.fb.group({
        contactos: this.fb.array([]),
      }, { validators: this.primerContactoObligatorioValidator() }),
    }, { validators: this.passwordMatchValidator });
  }

  get contactosEmergencia(): FormArray {
    return this.registroForm.get('contactosEmergencia.contactos') as FormArray;
  }

  agregarContacto(): void {
    if (this.contactosEmergencia.length < 3) {
      const contactoForm = this.fb.group({
        nombre: ['', Validators.required],
        telefono: ['', Validators.required],
        correo: ['', [Validators.required, Validators.email]],
      });
      this.contactosEmergencia.push(contactoForm);
    }
  }

  removerContacto(index: number): void {
    // No permitir remover el primer contacto
    if (index > 0) {
      this.contactosEmergencia.removeAt(index);
    }
  }

  passwordMatchValidator(group: FormGroup): { [key: string]: any } | null {
    const password = group.get('password')?.value;
    const confirmarPassword = group.get('confirmarPassword')?.value;
    return password === confirmarPassword ? null : { 'passwordMismatch': true };
  }

  private primerContactoObligatorioValidator() {
    return (group: FormGroup): ValidationErrors | null => {
      const contactosArray = group.get('contactos') as FormArray;
      
      if (!contactosArray || contactosArray.length === 0) {
        return { 'contactoObligatorio': true };
      }
      
      const primerContacto = contactosArray.at(0);
      if (!primerContacto) {
        return { 'contactoObligatorio': true };
      }

      const nombre = primerContacto.get('nombre')?.value;
      const telefono = primerContacto.get('telefono')?.value;
      const correo = primerContacto.get('correo')?.value;

      if (!nombre || !telefono || !correo) {
        return { 'contactoObligatorio': true };
      }

      return null;
    };
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;

    if (files && files.length > 0) {
      const file = files[0];

      // Validar tamaño (máx 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.error = 'El archivo no debe exceder 5MB';
        this.fotoFile = null;
        this.fotoPreview = null;
        return;
      }

      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        this.error = 'Por favor selecciona una imagen válida';
        this.fotoFile = null;
        this.fotoPreview = null;
        return;
      }

      this.fotoFile = file;
      this.error = null;

      // Mostrar previa
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.fotoPreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.registroForm.invalid) return;

    this.loading = true;
    this.error = null;
    this.success = null;

    const { nombre, correo, password } = this.registroForm.value;
    const contactosEmergencia = this.contactosEmergencia.value;

    this.authService.register(nombre, correo, password).subscribe({
      next: (response) => {
        this.loading = false;
        this.success = 'Registro exitoso. Redirigiendo al login...';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Error al registrarse';
      },
    });
  }

  irAlLogin(): void {
    this.router.navigate(['/login']);
  }
}
