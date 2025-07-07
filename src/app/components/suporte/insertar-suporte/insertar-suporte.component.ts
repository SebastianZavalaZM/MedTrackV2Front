import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink, Router, ActivatedRoute, Params } from '@angular/router';
import { Suporte } from '../../../models/Suporte';
import { SuporteService } from '../../../services/suporte.service';
import { Usuarios } from '../../../models/Usuarios';
import { UsuariosService } from '../../../services/usuarios.service';

@Component({
  selector: 'app-insertar-suporte',
  templateUrl: './insertar-suporte.component.html',
  styleUrls: ['./insertar-suporte.component.css'],
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
export class InsertarSuporteComponent implements OnInit {
  form: FormGroup;
  listaUsuarios: Usuarios[] = [];
  suporte: Suporte = new Suporte();
  id: number = 0;
  edicion: boolean = false;

  constructor(
    private sS: SuporteService,
    private uS: UsuariosService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.form = this.formBuilder.group({
      titulo: ['', Validators.required],
      fecha: ['', Validators.required],
      descripcion: ['', Validators.required],
      users: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      
      if (this.edicion) {
        this.init();
      }
    });

    this.uS.list().subscribe((data: Usuarios[]) => {
      this.listaUsuarios = data;
    });
  }

  init(): void {
    if (this.edicion && this.id) {
      this.sS.listId(this.id).subscribe((data: Suporte) => {
        this.form.patchValue({
          titulo: data.titulo,
          fecha: data.fecha,
          descripcion: data.descripcion,
          users: data.users
        });
      });
    }
  }

  aceptar(): void {
    if (this.form.valid) {
      this.suporte.titulo = this.form.value.titulo;
      this.suporte.fecha = this.form.value.fecha;
      this.suporte.descripcion = this.form.value.descripcion;
      this.suporte.users = this.form.value.users;

      if (this.edicion) {
        this.suporte.idsuporte = this.id;
        this.sS.update(this.suporte).subscribe(() => {
          this.router.navigate(['/soporte/listar']);
        });
      } else {
        this.sS.insert(this.suporte).subscribe(() => {
          this.router.navigate(['/soporte/listar']);
        });
      }
    }
  }
}