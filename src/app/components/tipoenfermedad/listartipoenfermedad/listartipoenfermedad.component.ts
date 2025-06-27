import { Component, OnInit } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { TipoEnfermedad } from '../../../models/tipoenfermedad';
import { TipoenfermedadService } from '../../../services/tipoenfermedad.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';


@Component({
  selector: 'app-listartipoenfermedad',
  imports: [
    MatTableModule,
    CommonModule,
    MatButtonModule,
    RouterLink,
    MatIconModule,
    MatTooltipModule
    
  ],
  templateUrl: './listartipoenfermedad.component.html',
  styleUrl: './listartipoenfermedad.component.css'
})
export class ListartipoenfermedadComponent implements OnInit {
  dataSource: MatTableDataSource<TipoEnfermedad> = new MatTableDataSource()
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5']
  constructor(private tS: TipoenfermedadService) { }

  ngOnInit(): void {
    this.tS.list().subscribe(data => {
      this.dataSource = new MatTableDataSource(data)
    })
    this.tS.getList().subscribe(data => {
      this.dataSource = new MatTableDataSource(data)
    })

  }

  eliminar(id: number) {
    this.tS.deleteS(id).subscribe(data=>{
      this.tS.list().subscribe(data=>{
        this.tS.setList(data)
      })
    })
  }

}
