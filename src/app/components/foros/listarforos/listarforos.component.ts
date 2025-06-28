import { Component, inject, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table'
import { CommonModule } from '@angular/common';
import { MatIconModule} from '@angular/material/icon';
import { ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Foros } from '../../../models/Foros';
import { ForosService } from '../../../services/foros.service';

@Component({
  selector: 'app-listarforos',
  imports: [
    MatTableModule,
    MatIconModule,
    CommonModule,
    MatPaginatorModule,
    RouterLink,
  ],
  templateUrl: './listarforos.component.html',
  styleUrl: './listarforos.component.css'
})
export class ListarforosComponent implements OnInit {

  dataSource: MatTableDataSource<Foros> = new MatTableDataSource()
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7'];
  
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  
  private snackBar = inject(MatSnackBar);

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action);
  }

  constructor(private fS:ForosService){}

    ngOnInit(): void {
    this.fS.list().subscribe(data => {
      this.dataSource= new MatTableDataSource(data)
      this.dataSource.paginator = this.paginator;
    })

    this.fS.getList().subscribe((data)=>{
      this.dataSource=new MatTableDataSource(data)
      this.dataSource.paginator = this.paginator;
    })
  }
  
  eliminar(id: number) {
    this.fS.deleteF(id).subscribe(data => {
      this.fS.list().subscribe(data => {
         this.fS.setList(data)
        })
    })
  }
}
