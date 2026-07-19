import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-solar-icons',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg *ngIf="name === 'voltage'" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polygon points="12 2 20 7 20 17 12 22 4 17 4 7 12 2"></polygon>
      <line x1="12" y1="12" x2="12" y2="16"></line>
      <line x1="12" y1="8" x2="12" y2="4"></line>
    </svg>

    <svg *ngIf="name === 'current'" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M12 6v12M6 12h12"></path>
    </svg>

    <svg *ngIf="name === 'power'" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path>
      <line x1="12" y1="2" x2="12" y2="12"></line>
    </svg>

    <svg *ngIf="name === 'temperature'" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 2v20"></path>
      <path d="M4 12c0-4.4 3.6-8 8-8s8 3.6 8 8"></path>
      <circle cx="12" cy="19" r="2"></circle>
    </svg>

    <svg *ngIf="name === 'battery'" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="2" y="7" width="18" height="11" rx="2"></rect>
      <line x1="22" y1="11" x2="22" y2="13"></line>
      <rect x="5" y="10" width="12" height="5" fill="currentColor"></rect>
    </svg>

    <svg *ngIf="name === 'time'" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>

    <svg *ngIf="name === 'chart'" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <line x1="3" y1="3" x2="3" y2="21"></line>
      <line x1="3" y1="21" x2="21" y2="21"></line>
      <polyline points="3 18 7 14 11 17 15 10 19 13 21 11"></polyline>
    </svg>

    <svg *ngIf="name === 'location'" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg>

    <svg *ngIf="name === 'alert'" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3.05h16.94a2 2 0 0 0 1.71-3.05L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
      <line x1="12" y1="9" x2="12" y2="13"></line>
      <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>

    <svg *ngIf="name === 'settings'" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="3"></circle>
      <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m0 5.08l4.24 4.24M1 12h6m6 0h6m-16.78 7.78l4.24-4.24m5.08 0l4.24-4.24"></path>
    </svg>

    <svg *ngIf="name === 'audit'" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"></path>
      <polyline points="9 9 9 13 15 13 15 9"></polyline>
      <line x1="9" y1="17" x2="15" y2="17"></line>
    </svg>

    <svg *ngIf="name === 'download'" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>

    <svg *ngIf="name === 'filter'" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
    </svg>

    <svg *ngIf="name === 'close'" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  `,
  styles: [`
    .icon {
      width: 100%;
      height: 100%;
      display: inline-block;
    }
  `],
})
export class SolarIconsComponent {
  name: string = '';
}
