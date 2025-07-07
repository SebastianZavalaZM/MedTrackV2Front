import { Component, inject, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table'
import { CommonModule } from '@angular/common';
import { MatIconModule} from '@angular/material/icon';
import { ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ComenarioForos } from '../../../models/ComentarioForos';
import { ComentarioforosService } from '../../../services/comentarioforos.service';


@Component({
  selector: 'app-listarcomentarioforos',
  imports: [
    MatTableModule,
    MatIconModule,
    CommonModule,
    MatPaginatorModule,
    RouterLink,
  ],
  templateUrl: './listarcomentarioforos.component.html',
  styleUrl: './listarcomentarioforos.component.css'
})
export class ListarcomentarioforosComponent implements OnInit {

   dataSource: MatTableDataSource<ComenarioForos> = new MatTableDataSource()
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7'];
  
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  
  private snackBar = inject(MatSnackBar);

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action);
  }

  constructor(private cfS:ComentarioforosService){}

    ngOnInit(): void {
    this.cfS.list().subscribe(data => {
      this.dataSource= new MatTableDataSource(data)
      this.dataSource.paginator = this.paginator;
    })

    this.cfS.getList().subscribe((data)=>{
      this.dataSource=new MatTableDataSource(data)
      this.dataSource.paginator = this.paginator;
    })
  }
  
  eliminar(id: number) {
    this.cfS.deleteCF(id).subscribe(data => {
      this.cfS.list().subscribe(data => {
         this.cfS.setList(data)
        })
    })
  }

}
