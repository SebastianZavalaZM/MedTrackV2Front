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
import {Usuarios} from '../../../models/Usuarios';
import {UsuariosService} from '../../../services/usuarios.service';
import {Router} from '@angular/router';
import {MatRadioButton, MatRadioGroup} from '@angular/material/radio';

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
    RouterLink,
    MatRadioGroup,
    MatRadioButton
  ],
  templateUrl: './insertareditar.component.html',
  styleUrl: './insertareditar.component.css'
})
export class InsertareditarComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  usuario: Usuarios = new Usuarios();

  status:boolean=true

  id: number = 0
  edicion: boolean = false

  constructor(private uS: UsuariosService,
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
      username: ['', Validators.required],
      correo: ['', Validators.required],
      password: ['', Validators.required],
      fecharegistro: [new Date(), Validators.required],
      ubicacion: ['', Validators.required],
      longitudUsuario: [0, Validators.required],
      latitudUsuario: [0, Validators.required],
      enabled: ['', Validators.required]

    })
  }

  aceptar(): void {
    if (this.form.valid) {
      this.usuario.idUsers = this.form.value.codigo;
      this.usuario.username = this.form.value.username;
      this.usuario.correo = this.form.value.correo;
      this.usuario.password = this.form.value.password;
      this.usuario.fecharegistro = this.form.value.fecharegistro;
      this.usuario.ubicacion = this.form.value.ubicacion;
      this.usuario.longitudUsuario = this.form.value.longitudUsuario;
      this.usuario.latitudUsuario = this.form.value.latitudUsuario;
      this.usuario.enabled = this.form.value.enabled;

      if (this.edicion) {
      //actualizar
        this.uS.update(this.usuario).subscribe(data => {
          this.uS.list().subscribe(data => {
             this.uS.setList(data)
          })
       })
      } else {
      //insertar
        this.uS.insert(this.usuario).subscribe(data => {
          this.uS.list().subscribe(data => {
            this.uS.setList(data)
         })
       })
      }
      this.router.navigate(['usuarios'])
    }
  }
  
  init(){
    if(this.edicion) {
      this.uS.listId(this.id).subscribe(data => {
        this.form = new FormGroup({
          codigo: new FormControl(data.idUsers),
          username: new FormControl(data.username),
          correo: new FormControl(data.correo),
          password: new FormControl(data.password),
          fecharegistro: new FormControl(data.fecharegistro),
          ubicacion: new FormControl(data.ubicacion),
          longitudUsuario: new FormControl(data.longitudUsuario),
          latitudUsuario: new FormControl(data.latitudUsuario),
          enabled: new FormControl(data.enabled)
        })
      })
    }
  }
}



