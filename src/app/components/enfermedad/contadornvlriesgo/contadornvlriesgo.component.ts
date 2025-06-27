import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { EnfermedadService } from '../../../services/enfermedad.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-contadornvlriesgo',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule
  ],
  templateUrl: './contadornvlriesgo.component.html',
  styleUrls: ['./contadornvlriesgo.component.css']
})
export class ContadornvlriesgoComponent implements OnInit {
  displayedColumns: string[] = ['nivelRiesgo', 'cantidad'];
  dataSource: MatTableDataSource<{ nivelRiesgo: string; cantidad: number }> = new MatTableDataSource();

  constructor(private enfermedadService: EnfermedadService) {}

  ngOnInit(): void {
  this.enfermedadService.contarPorNivelRiesgo().subscribe(res => {
    // res es un array de arrays: [ [nivel, cantidad], ... ]
    const data = res.map(item => ({
      nivelRiesgo: item[0],
      cantidad: item[1]
    }));
    this.dataSource = new MatTableDataSource(data);
  });
  }
}