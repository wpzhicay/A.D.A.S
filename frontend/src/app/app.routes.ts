import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HistorialComponent } from './components/historial/historial.component';
import { MapaComponent } from './components/mapa/mapa.component';
import { DispositivosComponent } from './components/dispositivos/dispositivos.component';
import { ConfiguracionComponent } from './components/configuracion/configuracion.component';
import { AuditoriaComponent } from './components/auditoria/auditoria.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: '', component: InicioComponent, canActivate: [authGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'historial', component: HistorialComponent, canActivate: [authGuard] },
  { path: 'mapa', component: MapaComponent, canActivate: [authGuard] },
  { path: 'dispositivos', component: DispositivosComponent, canActivate: [authGuard] },
  { path: 'configuracion', component: ConfiguracionComponent, canActivate: [authGuard] },
  { path: 'auditoria', component: AuditoriaComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '/login' },
];
