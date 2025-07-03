import { Component, OnInit } from '@angular/core';
import { TipoSuscripcionService } from '../../services/tipo-suscripcion.service';
import { TipoSuscripcion } from '../../models/TipoSuscripcion';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-tiposuscripcion',
  templateUrl: './tiposuscripcion.component.html',
  styleUrls: ['./tiposuscripcion.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class TiposuscripcionComponent implements OnInit {
  tipos: TipoSuscripcion[] = [];
  displayedColumns: string[] = ['codigo', 'descripcion', 'fechaInicio', 'fechaFin', 'usuario'];

  constructor(private tipoService: TipoSuscripcionService) {}

  ngOnInit() {
    this.tipoService.list().subscribe(data => this.tipos = data);
  }
}