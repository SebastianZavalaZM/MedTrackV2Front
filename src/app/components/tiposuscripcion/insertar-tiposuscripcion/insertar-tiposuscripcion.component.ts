import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { RouterLink, Router } from '@angular/router';
import { TipoSuscripcion } from '../../../models/TipoSuscripcion';
import { TipoSuscripcionService } from '../../../services/tipo-suscripcion.service';

@Component({
  selector: 'app-insertar-tiposuscripcion',
  templateUrl: './insertar-tiposuscripcion.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    RouterLink
  ]
})
export class InsertarTiposuscripcionComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  
  constructor(
    private tS: TipoSuscripcionService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      codigo: ['', Validators.required],
      descripcion: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required]
    });
  }

  aceptar(): void {
    if (this.form.valid) {
      const tiposuscripcion = new TipoSuscripcion();
      tiposuscripcion.codigo = this.form.value.codigo;
      tiposuscripcion.descripcion = this.form.value.descripcion;
      tiposuscripcion.fechaInicio = this.form.value.fechaInicio;
      tiposuscripcion.fechaFin = this.form.value.fechaFin;

      this.tS.insert(tiposuscripcion).subscribe(() => {
        this.tS.list().subscribe(data => {
          this.tS.setList(data);
        });
      });
      this.router.navigate(['/tiposuscripcion/listar']);
    }
  }
}
