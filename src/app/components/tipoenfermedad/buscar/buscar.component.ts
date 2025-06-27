import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TipoEnfermedad } from '../../../models/tipoenfermedad';
import { TipoenfermedadService } from '../../../services/tipoenfermedad.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-buscar',
  imports: [
    MatTableModule,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './buscar.component.html',
  styleUrl: './buscar.component.css'
})
export class BuscarteComponent implements OnInit {
  dataSource: MatTableDataSource<TipoEnfermedad> = new MatTableDataSource()
  displayedColumns: string[] = ['c1', 'c2', 'c3']
  form: FormGroup;

  mensaje: string = ""
  notResults: boolean = false

  nombreBusqueda: string = ""

  constructor(
    private sS: TipoenfermedadService,
    private fb: FormBuilder) {
    this.form = fb.group({
      nombre: ['']
    })
  }

  ngOnInit(): void {
    this.sS.list().subscribe(data => {
      this.dataSource = new MatTableDataSource(data)
    })
    this.form.get('nombre')?.valueChanges.subscribe(value => {
      this.nombreBusqueda = value
      this.buscar()
    })
  }

  buscar() {
    if (this.nombreBusqueda && this.nombreBusqueda.trim()) {
      this.sS.searchNombre(this.nombreBusqueda).subscribe(data => {
        this.dataSource = new MatTableDataSource(data);
        this.notResults = data.length === 0;
      });
    } else {
      this.sS.list().subscribe(data => {
        this.dataSource = new MatTableDataSource(data);
        this.notResults = false;
      });
    }
  }

}
