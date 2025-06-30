import { Component, OnInit } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { Enfermedad } from '../../../models/enfermedad';
import { EnfermedadService } from '../../../services/enfermedad.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';



@Component({
  selector: 'app-listarenfermedad',
  imports: [
    MatTableModule,
    CommonModule,
    MatButtonModule,
    RouterLink,
    MatIconModule,
    MatTooltipModule
    
  ],
  templateUrl: './listarenfermedad.component.html',
  styleUrl: './listarenfermedad.component.css'
})
export class ListarenfermedadComponent implements OnInit {
  dataSource: MatTableDataSource<Enfermedad> = new MatTableDataSource()
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6']
  constructor(private eS: EnfermedadService) { }

  ngOnInit(): void {
    this.eS.list().subscribe(data => {
      this.dataSource = new MatTableDataSource(data)
    })
    this.eS.getList().subscribe(data => {
      this.dataSource = new MatTableDataSource(data)
    })

  }

  eliminar(id: number) {
    this.eS.deleteS(id).subscribe(data=>{
      this.eS.list().subscribe(data=>{
        this.eS.setList(data)
      })
    })
  }

}
