import { Component, OnInit } from '@angular/core';
import { SuporteService } from '../../services/suporte.service';
import { Suporte } from '../../models/Suporte';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-suporte',
  templateUrl: './suporte.component.html',
  styleUrls: ['./suporte.component.css'],
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class SuporteComponent implements OnInit {
  suportes: Suporte[] = [];
  displayedColumns: string[] = ['titulo', 'fecha', 'descripcion', 'usuario'];

  constructor(private suporteService: SuporteService) {}

  ngOnInit() {
    this.suporteService.list().subscribe(data => this.suportes = data);
  }
}
