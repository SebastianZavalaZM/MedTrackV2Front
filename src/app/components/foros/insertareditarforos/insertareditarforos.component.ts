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
import { Foros } from '../../../models/Foros';
import { ForosService } from '../../../services/foros.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  templateUrl: './insertareditarforos.component.html',
  styleUrl: './insertareditarforos.component.css'
})
export class InsertareditarforosComponent implements OnInit {
  
  form: FormGroup = new FormGroup({})
  foros: Foros = new Foros()

  id: number = 0
  edicion: boolean = false

  private snackBar = inject(MatSnackBar);
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action);
  }

  constructor(
    private fS: ForosService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((data: Params) => {
      this.id = data['id']
      this.edicion = data['id'] != null
      //actualizar
      this.init()
    });

    this.form = this.formBuilder.group({
      idforum: [''],
      titulo: ['', [Validators.required,Validators.maxLength(150)]],
      descripcion: ['',[Validators.required,Validators.maxLength(150)]],
      fechacreacion: ['', Validators.required],
      Users: ['', Validators.required]
    })

  }

  aceptar() {
    if (this.form.valid) {
      this.foros.idforum = this.form.value.idforum
      this.foros.titulo = this.form.value.titulo
      this.foros.descripcion = this.form.value.descripcion
      this.foros.fechacreacion = this.form.value.fechacreacion
      this.foros.Users = this.form.value.Users

      if (this.edicion) {
        //actualizar
        this.fS.update(this.foros).subscribe(data => {
          this.fS.list().subscribe(data => {
            this.fS.setList(data)
          })
        })
      } else {
        //INSERTAR
        this.fS.insert(this.foros).subscribe(data => {
          this.fS.list().subscribe(data => {
            this.fS.setList(data)
          })
        })
      }
      this.router.navigate(['Foros'])
    }
  }

  init() {
    if (this.edicion) {
      this.fS.listId(this.id).subscribe(data => {
        this.form = new FormGroup({
          idforum: new FormControl(data.idforum),
          titulo: new FormControl(data.titulo),
          descripcion: new FormControl(data.descripcion),
          fechacreacion: new FormControl(data.fechacreacion),
          Users: new FormControl(data.Users),
        })
      })
    }
  }
}
