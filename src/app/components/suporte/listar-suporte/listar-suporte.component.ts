import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Suporte } from '../../../models/Suporte';
import { SuporteService } from '../../../services/suporte.service';

@Component({
  selector: 'app-listar-suporte',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './listar-suporte.component.html',
  styleUrls: ['./listar-suporte.component.css']
})
export class ListarSuporteComponent implements OnInit {
  dataSource: MatTableDataSource<Suporte> = new MatTableDataSource();
  displayedColumns: string[] = ['titulo', 'fecha', 'descripcion', 'usuario', 'acciones']; // Cambiado 'users' por 'usuario'
  
  constructor(private sS: SuporteService) {}

  ngOnInit(): void {
    this.sS.list().subscribe((data: Suporte[]) => {
      this.dataSource = new MatTableDataSource(data);
    });
  }
}