import {Component, OnInit} from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {ActivatedRoute, Params, Router, RouterLink} from '@angular/router';
import {Notificacion} from '../../../models/notificacion';
import {MapacalorService} from '../../../services/mapacalor.service';
import {NotificacionService} from '../../../services/notificacion.service';
import {Mapacalor} from '../../../models/mapacalor';

@Component({
  selector: 'app-insertareditarnot',
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
  templateUrl: './insertareditarnot.component.html',
  styleUrl: './insertareditarnot.component.css'
})
export class InsertareditarnotComponent implements OnInit{
  form: FormGroup = new FormGroup({})
  notificacion: Notificacion = new Notificacion();

  id: number = 0
  edicion: boolean = false

  origenes:{value:string;viewValue:string}[]=[
    {value:'Sistema',viewValue:'Sistema'},
    {value:'Admin',viewValue:'Admin'},
    {value:'Sensor',viewValue:'Sensor'},
    {value:'Usuario',viewValue:'Usuario'}
  ]

  tiposnot:{value:string;viewValue:string}[]=[
    {value:'Alerta',viewValue:'Alerta'},
    {value:'Consejo',viewValue:'Consejo'},
    {value:'Información',viewValue:'Información'}
  ]

  listamapas: Mapacalor[] = []


  constructor(private nS: NotificacionService,
              private router: Router,
              private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private mS: MapacalorService,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      //actualizar
      this.init();
    });

    this.form = this.formBuilder.group({
      codigonot: [''],
      mensajenot: ['', Validators.required],
      fechaenvionot: ['', Validators.required],
      tiponot: ['', Validators.required],
      origennot: ['', Validators.required],
      mapacalor: ['', Validators.required]
    });

    this.mS.list().subscribe(data => {
      this.listamapas = data;
    });
  }

  aceptar() {
    if (this.form.valid) {
      this.notificacion.idnotification = this.form.value.codigonot
      this.notificacion.mensaje = this.form.value.mensajenot
      this.notificacion.fechaenvio = this.form.value.fechaenvionot
      this.notificacion.tipo = this.form.value.tiponot
      this.notificacion.origen = this.form.value.origennot
      this.notificacion.mapacalor = { idmapacalor: this.form.value.mapacalor } as Mapacalor;

      if (this.edicion) {
        //actualizar
        this.nS.update(this.notificacion).subscribe(data => {
          this.nS.list().subscribe(data => {
            this.nS.setList(data)
          })
        })
      } else {
        //INSERTAR
        this.nS.insert(this.notificacion).subscribe(data => {
          this.nS.list().subscribe(data => {
            this.nS.setList(data)
          })
        })
      }
      this.router.navigate(['notification/listas'])
    }
  }
  init() {
    if (this.edicion) {
      this.nS.listId(this.id).subscribe(data => {
        this.form = new FormGroup({
          codigonot: new FormControl(data.idnotification),
          mensajenot: new FormControl(data.mensaje),
          fechaenvionot: new FormControl(data.fechaenvio),
          tiponot: new FormControl(data.tipo),
          origennot: new FormControl(data.origen),
          mapacalor: new FormControl(data.mapacalor?.idmapacalor)
        })
      })

    }
  }
}
