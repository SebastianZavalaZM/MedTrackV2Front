import {Component, OnInit} from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {Articuloinformativo} from '../../../models/articuloinformativo';
import {ArticuloinformativoService} from '../../../services/articuloinformativo.service';

@Component({
  selector: 'app-listarai',
  imports: [
    MatTableModule,
    CommonModule,
    MatButtonModule,
    RouterLink,
    MatIconModule
  ],
  templateUrl: './listarai.component.html',
  styleUrl: './listarai.component.css'
})
export class ListarusuariosComponent implements OnInit {
  dataSource: MatTableDataSource<Articuloinformativo> = new MatTableDataSource();
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7'];
  constructor(private aS: ArticuloinformativoService) { }

  ngOnInit(): void {
    this.aS.list().subscribe(data => {
      this.dataSource = new MatTableDataSource(data)
    })
    this.aS.getList().subscribe(data => {
      this.dataSource = new MatTableDataSource(data)
    })
  }

  eliminar(id: number) {
    this.aS.deleteA(id).subscribe(data=>{
      this.aS.list().subscribe(data=>{
        this.aS.setList(data)
      })
    })
  }

}
