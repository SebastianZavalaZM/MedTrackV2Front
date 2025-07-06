import {Component, OnInit} from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {Notificacion} from '../../../models/notificacion';
import {NotificacionService} from '../../../services/notificacion.service';

@Component({
  selector: 'app-listarnotificacion',
  imports: [
    MatTableModule,
    CommonModule,
    MatButtonModule,
    RouterLink,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './listarnotificacion.component.html',
  styleUrl: './listarnotificacion.component.css'
})
export class ListarnotificacionComponent implements OnInit{
  dataSource: MatTableDataSource<Notificacion> = new MatTableDataSource()
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8'];
  constructor(private nS: NotificacionService) { }

  ngOnInit(): void {
    this.nS.list().subscribe(data => {
      this.dataSource = new MatTableDataSource(data)
    })
    this.nS.getList().subscribe(data => {
      this.dataSource = new MatTableDataSource(data)
    })
  }
  eliminar(id: number) {
    this.nS.deleteN(id).subscribe(data => {
      this.nS.list().subscribe(data => {
        this.nS.setList(data)
      })
    })
  }
}
