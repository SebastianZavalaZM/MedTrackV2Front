import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource } from '@angular/material/table';
import { ReporteciudadanoService } from '../../../services/reporteciudadano.service';
import { Reporteciudadano } from '../../../models/reporteciudadano';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-buscar-por-ciudad-oenfermedad',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    FormsModule
  ],
  templateUrl: './buscar-por-ciudad-oenfermedad.component.html',
  styleUrls: ['./buscar-por-ciudad-oenfermedad.component.css']
})
export class BuscarPorCiudadOenfermedadComponent implements OnInit {

  dataSource = new MatTableDataSource<Reporteciudadano>();
  dataOriginal: Reporteciudadano[] = [];

  displayedColumns: string[] = ['c1', 'c2', 'c3'];

  cuidad: string = '';
  enfermedad: string = '';

  constructor(private reporteService: ReporteciudadanoService) {}

  ngOnInit(): void {
    this.reporteService.list().subscribe(data => {
      this.dataOriginal = data;
      this.dataSource.data = [...data];
    });
  }

  buscar(): void {
    const cuidadFiltro = this.cuidad.toLowerCase().trim();
    const enfermedadFiltro = this.enfermedad.toLowerCase().trim();

    this.dataSource.data = this.dataOriginal.filter(item => {
      const ciudadMatch = item.cuidad?.toLowerCase().includes(cuidadFiltro) || !cuidadFiltro;
      const enfermedadMatch = item.enfermedad?.nombre?.toLowerCase().includes(enfermedadFiltro) || !enfermedadFiltro;
      return ciudadMatch && enfermedadMatch;
    });
  }
}