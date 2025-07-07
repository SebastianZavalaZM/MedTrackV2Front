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
import { Usuarios } from '../../../models/Usuarios';
import { Enfermedad } from '../../../models/enfermedad';
import { UsuariosService } from '../../../services/usuarios.service';
import { EnfermedadService } from '../../../services/enfermedad.service';

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

  listarusers: any[] = []
  listarenfermedades: any[] = []

  constructor(private rS: ReporteciudadanoService,
              private router:Router,
              private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private uS: UsuariosService,
              private eS: EnfermedadService
            )
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
      id_reporte_ciudadano: [''],
      fechaReporte: [new Date(), Validators.required],
      cuidad: ['', Validators.required],
      enfermedad: ['', Validators.required],
      users: ['', Validators.required],
    })
    this.uS.list().subscribe(data => {
      this.listarusers = data;
    })
     this.eS.list().subscribe(data => {
      this.listarenfermedades = data;
    })
  }

  aceptar(): void {
    if (this.form.valid) {
      this.reporteciudadano.id_reporte_ciudadano = this.form.value.id_reporte_ciudadano
      this.reporteciudadano.fechaReporte = this.form.value.fechaReporte
      this.reporteciudadano.cuidad = this.form.value.cuidad
      this.reporteciudadano.enfermedad = { idEnfermedad: this.form.value.enfermedad } as Enfermedad
      this.reporteciudadano.users = { idUsers: this.form.value.users } as Usuarios


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
      this.router.navigate(['reporteciudadano/listas'])
    }
  }
  init(){
    if(this.edicion) {
      this.rS.listId(this.id).subscribe(data => {
        this.form = new FormGroup({
          id_reporte_ciudadano: new FormControl(data.id_reporte_ciudadano),
          fechaReporte: new FormControl(data.fechaReporte),
          cuidad: new FormControl(data.cuidad),
          enfermedad: new FormControl(data.enfermedad?.idEnfermedad),
          users: new FormControl(data.users?.idUsers),

        })
      })
    }
  }
}



