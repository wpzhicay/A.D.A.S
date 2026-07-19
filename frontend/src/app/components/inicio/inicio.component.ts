import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Dashboard } from '../../models/models';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class InicioComponent implements OnInit {
  dashboard: Dashboard | null = null;
  loading = true;
  error: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading = true;
    this.apiService.getDashboard(1).subscribe({
      next: (data) => {
        this.dashboard = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar los datos';
        this.loading = false;
      },
    });
  }

  getStatusClass(): string {
    if (!this.dashboard) return 'status-offline';
    return this.dashboard.estadoInversor === 'ONLINE'
      ? 'status-online'
      : 'status-offline';
  }
}
