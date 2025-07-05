import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TipoEnfermedad } from '../../../models/tipoenfermedad';
import { TipoenfermedadService } from '../../../services/tipoenfermedad.service';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Usuarios } from '../../../models/Usuarios';


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
  templateUrl: './insertareditar.component.html',
  styleUrl: './insertareditar.component.css'
})
export class InsertareditarteComponent implements OnInit {
  form: FormGroup = new FormGroup({})
  tipoenfermedad: TipoEnfermedad = new TipoEnfermedad()

  
  id: number = 0
  edicion: boolean = false

  constructor(private sS: TipoenfermedadService,
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
    }
    )



    this.form = this.formBuilder.group({
      codigo: [''],
      name: ['', Validators.required],
      description: ['', Validators.required],
      users: ['', Validators.required]
    })
  }

  aceptar() {
    if (this.form.valid) {
      this.tipoenfermedad.idTipo = this.form.value.codigo
      this.tipoenfermedad.nombre = this.form.value.name
      this.tipoenfermedad.descripcion = this.form.value.description
      this.tipoenfermedad.users = { idUsers: this.form.value.users } as Usuarios;


      if (this.edicion) {
        //actualizar
        this.sS.update(this.tipoenfermedad).subscribe(data => {
          this.sS.list().subscribe(data => {
            this.sS.setList(data)
          })
        })
      } else {
        //INSERTAR
        this.sS.insert(this.tipoenfermedad).subscribe(data => {
          this.sS.list().subscribe(data => {
            this.sS.setList(data)
          })
        })
      }
      this.router.navigate(['tipoenfermedades/listas'])
    }
  }
  init() {
    if (this.edicion) {
      this.sS.listId(this.id).subscribe(data => {
        this.form = new FormGroup({
          codigo: new FormControl(data.idTipo),
          name: new FormControl(data.nombre),
          description: new FormControl(data.descripcion),
          users: new FormControl(data.users?.idUsers)
          
        })
      })

    }
  }

}
