import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { Suporte } from '../../../models/Suporte';
import { SuporteService } from '../../../services/suporte.service';

@Component({
  selector: 'app-listar-suporte',
  standalone: true,
  imports: [
    MatTableModule,
    CommonModule,
    MatButtonModule,
    RouterLink,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './listar-suporte.component.html',
  styleUrl: './listar-suporte.component.css'
})
export class ListarSuporteComponent implements OnInit {
  dataSource: MatTableDataSource<Suporte> = new MatTableDataSource();
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7'];

  constructor(private sS: SuporteService) {}

  ngOnInit(): void {
    this.sS.list().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
    });
    this.sS.getList().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
    });
  }

  eliminar(id: number): void {
    this.sS.delete(id).subscribe(() => {
      this.sS.list().subscribe(data => {
        this.sS.setList(data);
      });
    });
  }
}