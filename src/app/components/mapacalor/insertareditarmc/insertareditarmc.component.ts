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
import {Mapacalor} from '../../../models/mapacalor';
import {MapacalorService} from '../../../services/mapacalor.service';
import {Usuarios} from '../../../models/Usuarios';
import {UsuariosService} from '../../../services/usuarios.service';

@Component({
  selector: 'app-insertareditarmc',
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
  templateUrl: './insertareditarmc.component.html',
  styleUrl: './insertareditarmc.component.css'
})
export class InsertareditarmcComponent implements OnInit{
  form: FormGroup = new FormGroup({})
  mapacalor: Mapacalor = new Mapacalor();

  id: number = 0
  edicion: boolean = false

  listausers: Usuarios[] = []

  niveles:{value:string;viewValue:string}[]=[
    {value:'Alto',viewValue:'Alto'},
    {value:'Medio',viewValue:'Medio'},
    {value:'Bajo',viewValue:'Bajo'}
  ]

  constructor(private mS: MapacalorService,
              private router: Router,
              private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private uS: UsuariosService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((data: Params) => {

        this.id = data['id']
        this.edicion = data['id'] != null
        //actualizar
        this.init()
      }
    )

    this.form = this.formBuilder.group({
      codigomc: [''],
      latitudmc: ['', Validators.required],
      longitudmc: ['', Validators.required],
      nivelriesgomc: ['', Validators.required],
      fechaactualizacionmc: ['', Validators.required],
      concentraciondecalormc: ['', Validators.required],
      users: ['', Validators.required]
    })
    this.uS.list().subscribe(data => {
      this.listausers = data;
    })
  }

  aceptar() {
    if (this.form.valid) {
      this.mapacalor.idmapacalor = this.form.value.codigomc
      this.mapacalor.latitud = this.form.value.latitudmc
      this.mapacalor.longitud = this.form.value.longitudmc
      this.mapacalor.nivelriesgo = this.form.value.nivelriesgomc
      this.mapacalor.fechaactualizacion = this.form.value.fechaactualizacionmc
      this.mapacalor.concentraciondecalor = this.form.value.concentraciondecalormc;
      this.mapacalor.users = { idUsers: this.form.value.users } as Usuarios;


      if (this.edicion) {
        //actualizar
        this.mS.update(this.mapacalor).subscribe(data => {
          this.mS.list().subscribe(data => {
            this.mS.setList(data)
          })
        })
      } else {
        //INSERTAR
        this.mS.insert(this.mapacalor).subscribe(data => {
          this.mS.list().subscribe(data => {
            this.mS.setList(data)
          })
        })
      }
      this.router.navigate(['mapacalor/listas'])
    }
  }
  init() {
    if (this.edicion) {
      this.mS.listId(this.id).subscribe(data => {
        this.form = new FormGroup({
          codigomc: new FormControl(data.idmapacalor),
          latitudmc: new FormControl(data.latitud),
          longitudmc: new FormControl(data.longitud),
          nivelriesgomc: new FormControl(data.nivelriesgo),
          fechaactualizacionmc: new FormControl(data.fechaactualizacion),
          concentraciondecalormc: new FormControl(data.concentraciondecalor),
          users: new FormControl(data.users?.idUsers)
        })
      })

    }
  }

}
