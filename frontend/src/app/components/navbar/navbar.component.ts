import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AlertasService } from '../../services/alertas.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
})
export class NavbarComponent implements OnInit {
  isMenuOpen = false;
  usuario$ = this.authService.usuario$;
  alertasNoLeidas = 0;

  constructor(
    public authService: AuthService,
    private alertasService: AlertasService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.alertasService.alertas$.subscribe((alertas) => {
      this.alertasNoLeidas = alertas.filter((a) => !a.leida).length;
    });
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
