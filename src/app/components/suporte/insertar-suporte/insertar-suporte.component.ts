import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { RouterLink, Router } from '@angular/router';
import { Suporte } from '../../../models/Suporte';
import { SuporteService } from '../../../services/suporte.service';

@Component({
  selector: 'app-insertar-suporte',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    RouterLink
  ],
  templateUrl: './insertar-suporte.component.html',
  styleUrls: ['./insertar-suporte.component.css']
})
export class InsertarSuporteComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  
  constructor(
    private sS: SuporteService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      titulo: ['', Validators.required],
      fecha: ['', Validators.required],
      descripcion: ['', Validators.required]
    });
  }

  aceptar(): void {
    if (this.form.valid) {
      const suporte = new Suporte();
      suporte.titulo = this.form.value.titulo;
      suporte.fecha = this.form.value.fecha;
      suporte.descripcion = this.form.value.descripcion;

      this.sS.insert(suporte).subscribe(() => {
        this.sS.list().subscribe(data => {
          this.sS.setList(data);
        });
      });
      this.router.navigate(['/soporte/listar']);
    }
  }
}
