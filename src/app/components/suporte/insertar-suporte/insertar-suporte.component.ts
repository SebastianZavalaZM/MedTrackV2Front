import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms'; // ← AGREGAR FormControl
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink, Router, ActivatedRoute, Params } from '@angular/router';
import { Suporte } from '../../../models/Suporte';
import { SuporteService } from '../../../services/suporte.service';
import { Usuarios } from '../../../models/Usuarios';
import { UsuariosService } from '../../../services/usuarios.service';

@Component({
  selector: 'app-insertar-suporte',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    CommonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatButtonModule,
    RouterLink
  ],
  templateUrl: './insertar-suporte.component.html',
  styleUrl: './insertar-suporte.component.css'
})
export class InsertarSuporteComponent implements OnInit {
  form: FormGroup = new FormGroup({})
  suporte: Suporte = new Suporte()

  id: number = 0
  edicion: boolean = false

  listausers: Usuarios[] = []

  constructor(private sS: SuporteService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private uS: UsuariosService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((data: Params) => {
      this.id = data['id']
      this.edicion = data['id'] != null
      this.init()
    })

    this.uS.list().subscribe(data => {
      this.listausers = data
    })

    this.form = this.formBuilder.group({
      codigo: [''],
      titulo: ['', Validators.required],
      fecha: ['', Validators.required],
      descripcion: ['', Validators.required],
      users: ['', Validators.required]
    })
  }

  aceptar() {
    if (this.form.valid) {
      this.suporte.idsuporte = this.form.value.codigo
      this.suporte.titulo = this.form.value.titulo
      this.suporte.fecha = this.form.value.fecha
      this.suporte.descripcion = this.form.value.descripcion
      this.suporte.users = this.form.value.users

      if (this.edicion) {
        this.sS.update(this.suporte).subscribe(data => {
          this.sS.list().subscribe(data => {
            this.sS.setList(data)
          })
          this.router.navigate(['soporte/listar']);
        })
      } else {
        this.sS.insert(this.suporte).subscribe(data => {
          this.sS.list().subscribe(data => {
            this.sS.setList(data)
          })
          this.router.navigate(['soporte/listar']);
        })
      }
    }
  }

  init() {
    if (this.edicion) {
      this.sS.listId(this.id).subscribe(data => {
        this.form = new FormGroup({
          codigo: new FormControl(data.idsuporte),
          titulo: new FormControl(data.titulo),
          fecha: new FormControl(data.fecha),
          descripcion: new FormControl(data.descripcion),
          users: new FormControl(data.users)
        })
      })
    }
  }
}