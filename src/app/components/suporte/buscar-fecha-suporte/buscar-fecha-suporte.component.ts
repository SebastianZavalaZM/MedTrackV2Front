import { Component, OnInit } from '@angular/core';
import { SuporteService } from '../../../services/suporte.service';
import { Suporte } from '../../../models/Suporte';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker'; // ← AGREGAR
import { MatNativeDateModule } from '@angular/material/core'; // ← AGREGAR

@Component({
  selector: 'app-buscar-fecha-suporte',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './buscar-fecha-suporte.component.html',
  styleUrl: './buscar-fecha-suporte.component.css'
})
export class BuscarFechaSuporteComponent implements OnInit {
  
  fechaDesde: Date = new Date(); // ← CAMBIAR A Date
  fechaHasta: Date = new Date(); // ← CAMBIAR A Date
  dataSource = new MatTableDataSource<Suporte>();
  displayedColumns: string[] = ['titulo', 'usuario', 'fecha', 'descripcion'];
  soportesOriginales: Suporte[] = [];

  constructor(private soporteService: SuporteService) {}

  ngOnInit(): void {
    this.cargarTodos();
  }

  cargarTodos(): void {
    this.soporteService.list().subscribe({
      next: (data) => {
        this.soportesOriginales = data;
        this.dataSource.data = data;
        console.log('Soportes cargados:', data);
      },
      error: (error) => {
        console.error('Error al cargar soportes:', error);
      }
    });
  }

  buscarPorRangoFechas(): void {
    if (this.fechaDesde && this.fechaHasta) {
      const fechaDesdeStr = this.formatearFecha(this.fechaDesde);
      const fechaHastaStr = this.formatearFecha(this.fechaHasta);
      
      this.soporteService.searchFecha(fechaDesdeStr, fechaHastaStr).subscribe({
        next: (data) => {
          this.dataSource.data = data;
          console.log('Soportes filtrados por fecha:', data);
        },
        error: (error) => {
          console.error('Error en búsqueda:', error);
          this.buscarLocal();
        }
      });
    } else {
      this.dataSource.data = this.soportesOriginales;
    }
  }

  buscarLocal(): void {
    const resultados = this.soportesOriginales.filter(soporte => {
      const fechaSoporte = new Date(soporte.fecha);
      return fechaSoporte >= this.fechaDesde && fechaSoporte <= this.fechaHasta;
    });
    
    this.dataSource.data = resultados;
  }

  limpiar(): void {
    this.fechaDesde = new Date();
    this.fechaHasta = new Date();
    this.dataSource.data = this.soportesOriginales;
  }

  formatearFecha(fecha: Date): string {
    return fecha.toISOString().split('T')[0];
  }
}