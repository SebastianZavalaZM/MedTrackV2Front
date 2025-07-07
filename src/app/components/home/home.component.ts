import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  stats = [
    { number: '1,000+', label: 'Usuarios Activos' },
    { number: '500+', label: 'Reportes Procesados' },
    { number: '50+', label: 'Enfermedades Monitoreadas' },
    { number: '24/7', label: 'Monitoreo Continuo' }
  ];
}