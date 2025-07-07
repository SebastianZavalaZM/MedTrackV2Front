import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink, Router } from '@angular/router';
import { TipoSuscripcion } from '../../../models/TipoSuscripcion';
import { TipoSuscripcionService } from '../../../services/tipo-suscripcion.service';
import { Usuarios } from '../../../models/Usuarios';
import { UsuariosService } from '../../../services/usuarios.service';

@Component({
  selector: 'app-insertar-tiposuscripcion',
  templateUrl: './insertar-tiposuscripcion.component.html',
  styleUrls: ['./insertar-tiposuscripcion.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    RouterLink
  ]
})
export class InsertarTiposuscripcionComponent implements OnInit {
  form: FormGroup;
  listaUsuarios: Usuarios[] = [];

  constructor(
    private tS: TipoSuscripcionService,
    private uS: UsuariosService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      nameSuscription: ['', Validators.required],
      descriptionSuscription: ['', Validators.required],
      startDateSuscription: ['', Validators.required],
      endDateSuscription: ['', Validators.required],
      users: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.uS.list().subscribe(data => {
      this.listaUsuarios = data;
    });
  }

  aceptar(): void {
    if (this.form.valid) {
      const tiposuscripcion = new TipoSuscripcion();
      tiposuscripcion.nameSuscription = this.form.value.nameSuscription;
      tiposuscripcion.descriptionSuscription = this.form.value.descriptionSuscription;
      tiposuscripcion.startDateSuscription = this.form.value.startDateSuscription;
      tiposuscripcion.endDateSuscription = this.form.value.endDateSuscription;
      tiposuscripcion.users = this.form.value.users;

      this.tS.insert(tiposuscripcion).subscribe(() => {
        this.router.navigate(['/tiposuscripcion/listar']);
      });
    }
  }
}
