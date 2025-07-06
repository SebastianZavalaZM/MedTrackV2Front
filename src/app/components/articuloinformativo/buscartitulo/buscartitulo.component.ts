import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { ArticuloinformativoService } from '../../../services/articuloinformativo.service';
import { Articuloinformativo } from '../../../models/articuloinformativo';
import { MatTableDataSource } from '@angular/material/table';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-buscartitulo',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    FormsModule
  ],
  templateUrl: './buscartitulo.component.html',
  styleUrls: ['./buscartitulo.component.css']
})
export class BuscartituloComponent implements OnInit {
  keyword: string = '';
  displayedColumns: string[] = ['titulo', 'contenido', 'fecha'];
  dataSource = new MatTableDataSource<Articuloinformativo>();

  constructor(private articuloService: ArticuloinformativoService) {}

  ngOnInit(): void {}

  buscar(): void {
    if (this.keyword.trim()) {
      this.articuloService.buscarPorTituloOContenido(this.keyword)
        .subscribe(data => this.dataSource.data = data);
    }
  }
}
