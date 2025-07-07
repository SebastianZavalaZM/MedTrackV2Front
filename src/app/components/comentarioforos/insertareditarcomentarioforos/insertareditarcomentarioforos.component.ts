import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ComenarioForos } from '../../../models/ComentarioForos';
import { ComentarioforosService } from '../../../services/comentarioforos.service';
import { Usuarios } from '../../../models/Usuarios';
import { Foros } from '../../../models/Foros';
import { ForosService } from '../../../services/foros.service';
import { UsuariosService } from '../../../services/usuarios.service';

@Component({
  selector: 'app-insertareditar',
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
  templateUrl: './insertareditarcomentarioforos.component.html',
  styleUrl: './insertareditarcomentarioforos.component.css'
})
export class InsertareditarcomentarioforosComponent implements OnInit {

  form: FormGroup = new FormGroup({})
  comentarioforos: ComenarioForos = new ComenarioForos()

  id: number = 0
  edicion: boolean = false

  listausers: Usuarios[] = []
  listaforos: Foros[] = []

  private snackBar = inject(MatSnackBar);
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action);
  }

  constructor(
    private cfS: ComentarioforosService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private uS: UsuariosService,
    private fS: ForosService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((data: Params) => {
      this.id = data['id']
      this.edicion = data['id'] != null
      //actualizar
      this.init()
    })

    this.form = this.formBuilder.group({
      id: [''],
      contenido: ['', [Validators.required,Validators.maxLength(1000)]],
      fechaComentario: ['', Validators.required],
      forums: ['', Validators.required],
      users: ['', Validators.required],
    })
     this.uS.list().subscribe(data => {
      this.listausers = data;
    })
     this.fS.list().subscribe(data => {
      this.listaforos = data;
    })
  }

  aceptar() {
    if (this.form.valid) {
      this.comentarioforos.id = this.form.value.id
      this.comentarioforos.contenido = this.form.value.contenido
      this.comentarioforos.fechaComentario = this.form.value.fechaComentario
      this.comentarioforos.forums = { idforum: this.form.value.forums } as Foros;
      this.comentarioforos.users = { idUsers: this.form.value.users } as Usuarios;

      if (this.edicion) {
        //actualizar
        this.cfS.update(this.comentarioforos).subscribe(data => {
          this.cfS.list().subscribe(data => {
            this.cfS.setList(data)  
          })
        })
      } else {
        //INSERTAR
        this.cfS.insert(this.comentarioforos).subscribe(data => {
          this.cfS.list().subscribe(data => {
            this.cfS.setList(data)
          })
        })
      }
      this.router.navigate(['Comentarios'])
    }
  }

  init() {
    if (this.edicion) {
      this.cfS.listId(this.id).subscribe(data => {
        this.form = new FormGroup({
          id: new FormControl(data.id),
          contenido: new FormControl(data.contenido),
          fechaComentario: new FormControl(data.fechaComentario),
          forums: new FormControl(data.forums?.idforum),
          users: new FormControl(data.users?.idUsers),
        })
      })
    }
  }
}
