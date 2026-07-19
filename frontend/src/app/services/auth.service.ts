import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    nombre: string;
    correo: string;
  };
}

export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private apiUrl = environment.apiUrl;

  private token: string | null = localStorage.getItem('token');

  private usuarioSubject = new BehaviorSubject<Usuario | null>(null);
  public usuario$ = this.usuarioSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(!!this.token);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();


  constructor(private http: HttpClient) {
    this.loadUserFromToken();
  }


  login(correo: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(
        `${this.apiUrl}/login`,
        {
          correo,
          password,
        }
      )
      .pipe(
        tap((response) => {
          this.token = response.token;

          localStorage.setItem('token', response.token);
          localStorage.setItem('usuario', JSON.stringify(response.user));

          this.usuarioSubject.next(response.user);
          this.isAuthenticatedSubject.next(true);
        }),
        catchError((err) => {
          console.error('Login error:', err);
          throw err;
        })
      );
  }


  register(
    nombre: string,
    correo: string,
    password: string
  ): Observable<LoginResponse> {

    return this.http.post<LoginResponse>(
      `${this.apiUrl}/auth/register`,
      {
        nombre,
        correo,
        password,
      }
    );
  }


  logout(): void {
    this.token = null;

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');

    this.usuarioSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }


  getToken(): string | null {
    return this.token;
  }


  isAuthenticated(): boolean {
    return !!this.token;
  }


  getUsuario(): Usuario | null {
    return this.usuarioSubject.value;
  }


  private loadUserFromToken(): void {
    const usuarioString = localStorage.getItem('usuario');

    if (usuarioString) {
      try {
        const usuario = JSON.parse(usuarioString);
        this.usuarioSubject.next(usuario);
      } catch (e) {
        console.error('Error parsing usuario', e);
      }
    }
  }

}