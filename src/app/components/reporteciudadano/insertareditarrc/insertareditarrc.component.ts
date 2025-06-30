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
import {Reporteciudadano} from '../../../models/reporteciudadano';
import {ReporteciudadanoService} from '../../../services/reporteciudadano.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-insertareditarrc',
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
  templateUrl: './insertareditarrc.component.html',
  styleUrl: './insertareditarrc.component.css'
})
export class InsertareditarrcComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  reporteciudadano: Reporteciudadano = new Reporteciudadano();

  status:boolean=true

  id: number = 0
  edicion: boolean = false

  constructor(private rS: ReporteciudadanoService,
              private router:Router,
              private formBuilder: FormBuilder,
              private route: ActivatedRoute)
  {}

  ngOnInit():void {
    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      //actualizar
      this.init()
    }
    )

    this.form = this.formBuilder.group({
      codigo: [''],
      fechaReporte: [new Date(), Validators.required],
      ciudad: ['', Validators.required]
    })
  }

  aceptar(): void {
    if (this.form.valid) {
      this.reporteciudadano.id = this.form.value.codigo;
      this.reporteciudadano.fechaReporte = this.form.value.fechaReporte;
      this.reporteciudadano.ciudad = this.form.value.ciudad;


      if (this.edicion) {
      //actualizar
        this.rS.update(this.reporteciudadano).subscribe(data => {
          this.rS.list().subscribe(data => {
             this.rS.setList(data)
          })
       })
      } else {
      //insertar
        this.rS.insert(this.reporteciudadano).subscribe(data => {
          this.rS.list().subscribe(data => {
            this.rS.setList(data)
         })
       })
     }
      this.router.navigate(['reporteciudadano'])
    }
  }
  init(){
    if(this.edicion) {
      this.rS.listId(this.id).subscribe(data => {
        this.form = new FormGroup({
          id: new FormControl(data.id),
          fechaReporte: new FormControl(data.fechaReporte),
          ciudad: new FormControl(data.ciudad),

        })
      })
    }
  }
}



