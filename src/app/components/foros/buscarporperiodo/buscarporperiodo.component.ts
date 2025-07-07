import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Foros } from '../../../models/Foros';
import { ForosService } from '../../../services/foros.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-buscarporperiodo',
  imports: [
    MatTableModule,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule     
  ],
  templateUrl: './buscarporperiodo.component.html',
  styleUrl: './buscarporperiodo.component.css'
})
export class BuscarporperiodoComponent implements OnInit {

  dataSource: MatTableDataSource<Foros>;
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5'];
  form: FormGroup;

  notResults: boolean = false;

  constructor(
    private fS: ForosService,
    private fb: FormBuilder
  ) {
    this.form = fb.group({
      fechaInicio: [''],
      fechaFin: ['']
    });
    this.dataSource = new MatTableDataSource<Foros>([]);
  }

  ngOnInit(): void {
    this.dataSource.data = [];
  }
  
  buscar() {
    const fechaInicio = this.form.get('fechaInicio')?.value;
    const fechaFin = this.form.get('fechaFin')?.value;
    if (fechaInicio && fechaFin) {
      const inicioStr = this.formatDate(fechaInicio);
      const finStr = this.formatDate(fechaFin);
      this.fS.searchDateRange(inicioStr, finStr).subscribe(data => {
        this.dataSource.data = data;
        this.notResults = data.length === 0
      });
    } else {
      this.dataSource.data = [];
      this.notResults = false;
    }
  }

  formatDate(date: Date): string {
    if (!date) return '';
    const d = new Date(date);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return `${d.getFullYear()}-${month}-${day}`;
  }
}
