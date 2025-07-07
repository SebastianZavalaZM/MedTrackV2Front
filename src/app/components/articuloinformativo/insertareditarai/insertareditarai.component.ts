import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Articuloinformativo } from '../../../models/articuloinformativo';
import { ArticuloinformativoService } from '../../../services/articuloinformativo.service';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-insertareditarai',
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
  templateUrl: './insertareditarai.component.html',
  styleUrl: './insertareditarai.component.css'
})
export class InsertareditaraiComponent implements OnInit {
  form: FormGroup = new FormGroup({})
  articulo: Articuloinformativo = new Articuloinformativo()

  
  id: number = 0
  edicion: boolean = false

  constructor(private aS: ArticuloinformativoService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((data: Params) => {

      this.id = data['id'];
      this.edicion = data['id'] != null;
      //actualizar
      this.init()
    }
    )



    this.form = this.formBuilder.group({
      codigo: [''],
      titulo: ['', Validators.required],
      contenido: ['', Validators.required],
      fechaPublicacion: [new Date(), Validators.required],
      fuente: ['', Validators.required],
    })
  }

  aceptar() {
    if (this.form.valid) {
      this.articulo.idArticulo = this.form.value.codigo
      this.articulo.titulo = this.form.value.titulo
      this.articulo.contenido = this.form.value.contenido
      this.articulo.fechaPublicacion = this.form.value.fechaPublicacion
      this.articulo.fuente = this.form.value.fuente


      if (this.edicion) {
        //actualizar
        this.aS.update(this.articulo).subscribe(data => {
          this.aS.list().subscribe(data => {
            this.aS.setList(data)
          })
        })
      } else {
        //INSERTAR
        this.aS.insert(this.articulo).subscribe(data => {
          this.aS.list().subscribe(data => {
            this.aS.setList(data)
          })
        })
      }
      this.router.navigate(['articuloinformativo/listas'])
    }
  }
  init() {
    if (this.edicion) {
      this.aS.listId(this.id).subscribe(data => {
        this.form = new FormGroup({
          codigo: new FormControl(data.idArticulo),
          titulo: new FormControl(data.titulo),
          contenido: new FormControl(data.contenido),
          fechaPublicacion: new FormControl(data.fechaPublicacion),
          fuente: new FormControl(data.fuente)
          
        })
      })

    }
  }

}