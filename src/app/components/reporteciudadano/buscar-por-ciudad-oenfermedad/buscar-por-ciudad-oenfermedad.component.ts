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
  cuidad: string = '';
  enfermedad: string = '';
  displayedColumns: string[] = ['fechaReporte', 'cuidad', 'usuario', 'enfermedad'];
  dataSource = new MatTableDataSource<Reporteciudadano>();

  constructor(private reporteService: ReporteciudadanoService) {}

  ngOnInit(): void {}

  buscar(): void {
    this.reporteService.buscarPorCiudadOEnfermedad(this.cuidad, this.enfermedad)
      .subscribe(data => this.dataSource.data = data);
  }
}
