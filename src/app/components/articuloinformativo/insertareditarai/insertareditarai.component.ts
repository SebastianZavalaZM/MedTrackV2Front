import {Component, OnInit} from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {ActivatedRoute, Params, RouterLink} from '@angular/router';
import {Articuloinformativo} from '../../../models/articuloinformativo';
import {ArticuloinformativoService} from '../../../services/articuloinformativo.service';
import {Router} from '@angular/router';

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
  form: FormGroup = new FormGroup({});
  articuloinformativo: Articuloinformativo = new Articuloinformativo();

  status:boolean=true

  id: number = 0
  edicion: boolean = false

  constructor(private aS: ArticuloinformativoService,
              private router:Router,
              private formBuilder: FormBuilder,
              private route: ActivatedRoute)
  {}

  ngOnInit():void {
    this.route.params.subscribe((data: Params) => {
      this.id = data['idArticulo'];
      this.edicion = data['idArticulo'] != null;
      //actualizar
      this.init()
    }
    )

    this.form = this.formBuilder.group({
      codigo: [''],
      titulo: ['', Validators.required],
      contenido: ['', Validators.required],
      fechaPublicacion: [new Date(), Validators.required],
      fuente: ['', Validators.required]
    })
  }

  aceptar(): void {
    if (this.form.valid) {
      this.articuloinformativo.idArticulo = this.form.value.codigo;
      this.articuloinformativo.titulo = this.form.value.titulo;
      this.articuloinformativo.contenido = this.form.value.contenido;
      this.articuloinformativo.fechaPublicacion = this.form.value.fechaPublicacion;
      this.articuloinformativo.fuente = this.form.value.fuente;


      if (this.edicion) {
      //actualizar
        this.aS.update(this.articuloinformativo).subscribe(data => {
          this.aS.list().subscribe(data => {
             this.aS.setList(data)
          })
       })
      } else {
      //insertar
        this.aS.insert(this.articuloinformativo).subscribe(data => {
          this.aS.list().subscribe(data => {
            this.aS.setList(data)
         })
       })
     }
      this.router.navigate(['articuloinformativo'])
    }
  }
  init(){
    if(this.edicion) {
      this.aS.listId(this.id).subscribe(data => {
        this.form = new FormGroup({
          idArticulo: new FormControl(data.idArticulo),
          titulo: new FormControl(data.titulo),
          contenido: new FormControl(data.contenido),
          fechaPublicacion: new FormControl(data.fechaPublicacion),
          fuente: new FormControl(data.fuente),
        })
      })
    }
  }
}



