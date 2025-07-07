import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ComenarioForos } from '../../../models/ComentarioForos';
import { ComentarioforosService } from '../../../services/comentarioforos.service';

@Component({
  selector: 'app-buscarforo',
  imports: [
    MatTableModule,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './buscarforo.component.html',
  styleUrl: './buscarforo.component.css'
})
export class BuscarforoComponent implements OnInit {
  
  dataSource: MatTableDataSource<ComenarioForos>;
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6'];
  form: FormGroup;

  mensaje: string = ""
  notResults: boolean = false

  tituloBusqueda: string = ""

  constructor(
    private cfS: ComentarioforosService,
    private fb: FormBuilder) {
    this.form = fb.group({
      foro: ['']
    });
    this.dataSource = new MatTableDataSource<ComenarioForos>([]); // inicializa con tipo correcto
  }

  ngOnInit(): void {
    this.dataSource.data = [];
    this.form.get('foro')?.valueChanges.subscribe(value => {
      this.tituloBusqueda = value;
      this.buscar();
    });
  }

  buscar() {
    if (this.tituloBusqueda && this.tituloBusqueda.trim()) {
      this.cfS.searchTitle(this.tituloBusqueda).subscribe(data => {
        this.dataSource.data = data; 
        this.notResults = data.length === 0;
      });
    } else {
      this.dataSource.data = [];
      this.notResults = false;
    }
  }
}
