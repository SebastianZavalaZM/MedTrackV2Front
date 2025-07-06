import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink, Router } from '@angular/router';
import { Suporte } from '../../../models/Suporte';
import { SuporteService } from '../../../services/suporte.service';
import { Usuarios } from '../../../models/Usuarios';
import { UsuariosService } from '../../../services/usuarios.service';

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
    MatSelectModule,
    RouterLink
  ],
  templateUrl: './insertar-suporte.component.html',
  styleUrls: ['./insertar-suporte.component.css']
})
export class InsertarSuporteComponent implements OnInit {
  form: FormGroup = new FormGroup({
    titulo: new FormControl('', Validators.required),
    fecha: new FormControl('', Validators.required),
    descripcion: new FormControl('', Validators.required),
    idUsuario: new FormControl('', Validators.required)
  });
  listaUsuarios: Usuarios[] = [];

  constructor(
    private sS: SuporteService,
    private uS: UsuariosService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    this.uS.list().subscribe(data => {
      this.listaUsuarios = data;
    });
  }

  aceptar(): void {
    if (this.form.valid) {
      const suporte = new Suporte();
      suporte.titulo = this.form.value.titulo;
      suporte.fecha = this.form.value.fecha;
      suporte.descripcion = this.form.value.descripcion;
      suporte.users = this.form.value.idUsuario;

      this.sS.insert(suporte).subscribe(() => {
        this.router.navigate(['/soporte/listar']);
      });
    }
  }
}
