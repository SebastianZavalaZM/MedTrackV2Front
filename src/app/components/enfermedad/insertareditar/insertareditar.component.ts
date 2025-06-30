import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Enfermedad } from '../../../models/enfermedad';
import { EnfermedadService } from '../../../services/enfermedad.service';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';


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
export class InsertareditareComponent implements OnInit {
  form: FormGroup = new FormGroup({})
  enfermedad: Enfermedad = new Enfermedad()

  
  id: number = 0
  edicion: boolean = false

  constructor(private eS: EnfermedadService,
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
      sintomas: ['', Validators.required],
      nivelRiesgo: ['', Validators.required],
    })
  }

  aceptar() {
    if (this.form.valid) {
      this.enfermedad.idEnfermedad = this.form.value.codigo
      this.enfermedad.nombre = this.form.value.name
      this.enfermedad.sintomas = this.form.value.sintomas
      this.enfermedad.nivelRiesgo = this.form.value.nivelRiesgo


      if (this.edicion) {
        //actualizar
        this.eS.update(this.enfermedad).subscribe(data => {
          this.eS.list().subscribe(data => {
            this.eS.setList(data)
          })
        })
      } else {
        //INSERTAR
        this.eS.insert(this.enfermedad).subscribe(data => {
          this.eS.list().subscribe(data => {
            this.eS.setList(data)
          })
        })
      }
      this.router.navigate(['enfermedades/listas'])
    }
  }
  init() {
    if (this.edicion) {
      this.eS.listId(this.id).subscribe(data => {
        this.form = new FormGroup({
          codigo: new FormControl(data.idEnfermedad),
          name: new FormControl(data.nombre),
          sintomas: new FormControl(data.sintomas),
          nivelRiesgo: new FormControl(data.nivelRiesgo)
          
        })
      })

    }
  }

}