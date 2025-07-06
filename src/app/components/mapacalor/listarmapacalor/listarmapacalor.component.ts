import {Component, OnInit} from '@angular/core';
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {CommonModule} from "@angular/common";
import {MatButtonModule} from "@angular/material/button";
import {RouterLink} from "@angular/router";
import {MatIconModule} from "@angular/material/icon";
import {MatTooltipModule} from "@angular/material/tooltip";
import {Mapacalor} from "../../../models/mapacalor";
import {MapacalorService} from "../../../services/mapacalor.service";

@Component({
  selector: 'app-listarmapacalor',
  imports: [
    MatTableModule,
    CommonModule,
    MatButtonModule,
    RouterLink,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './listarmapacalor.component.html',
  styleUrl: './listarmapacalor.component.css'
})
export class ListarmapacalorComponent implements OnInit{
  dataSource: MatTableDataSource<Mapacalor> = new MatTableDataSource()
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9'];
  constructor(private mS: MapacalorService) { }

  ngOnInit(): void {
    this.mS.list().subscribe(data => {
      this.dataSource = new MatTableDataSource(data)
    })
    this.mS.getList().subscribe(data => {
      this.dataSource = new MatTableDataSource(data)
    })

  }

  eliminar(id: number) {
    this.mS.deleteM(id).subscribe(data=>{
      this.mS.list().subscribe(data=>{
        this.mS.setList(data)
      })
    })
  }
}
