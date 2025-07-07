import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select'; // Agregar este
import { RouterLink, Router } from '@angular/router';
import { TipoSuscripcion } from '../../../models/TipoSuscripcion';
import { TipoSuscripcionService } from '../../../services/tipo-suscripcion.service';
import { Usuarios } from '../../../models/Usuarios'; // Agregar modelo Usuarios
import { UsuariosService } from '../../../services/usuarios.service'; // Agregar servicio de usuarios

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
    MatSelectModule, // Agregar este
    RouterLink
  ]
})
export class InsertarTiposuscripcionComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  listaUsuarios: Usuarios[] = []; // Agregar lista de usuarios

  constructor(
    private tS: TipoSuscripcionService,
    private uS: UsuariosService, // Agregar servicio de usuarios
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      codigo: ['', Validators.required],
      descripcion: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
      users: ['', Validators.required]
    });

    // Cargar lista de usuarios
    this.uS.list().subscribe(data => {
      this.listaUsuarios = data;
    });
  }

  aceptar(): void {
    if (this.form.valid) {
      const tiposuscripcion = new TipoSuscripcion();
      tiposuscripcion.codigo = this.form.value.codigo;
      tiposuscripcion.descripcion = this.form.value.descripcion;
      tiposuscripcion.fechaInicio = this.form.value.fechaInicio;
      tiposuscripcion.fechaFin = this.form.value.fechaFin;
      tiposuscripcion.users = this.form.value.users;

      this.tS.insert(tiposuscripcion).subscribe(() => {
        this.router.navigate(['/tiposuscripcion/listar']);
      });
    }
  }
}
