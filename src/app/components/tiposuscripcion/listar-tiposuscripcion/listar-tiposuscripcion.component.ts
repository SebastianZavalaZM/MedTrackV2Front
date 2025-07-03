import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TipoSuscripcion } from '../../../models/TipoSuscripcion';
import { TipoSuscripcionService } from '../../../services/tipo-suscripcion.service';

@Component({
  selector: 'app-listar-tiposuscripcion',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, RouterLink, MatIconModule],
  templateUrl: './listar-tiposuscripcion.component.html',
  styleUrls: ['./listar-tiposuscripcion.component.css']
})
export class ListarTiposuscripcionComponent implements OnInit {
  dataSource: MatTableDataSource<TipoSuscripcion> = new MatTableDataSource();
  displayedColumns: string[] = ['codigo', 'descripcion', 'fechaInicio', 'fechaFin', 'usuario', 'acciones']; // Cambiado 'users' por 'usuario'
  
  constructor(private tS: TipoSuscripcionService) {}

  ngOnInit(): void {
    this.tS.list().subscribe((data: TipoSuscripcion[]) => {
      this.dataSource = new MatTableDataSource(data);
    });
  }
}
