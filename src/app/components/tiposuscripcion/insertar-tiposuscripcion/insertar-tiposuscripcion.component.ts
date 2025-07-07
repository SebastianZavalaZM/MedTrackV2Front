import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink, Router, ActivatedRoute, Params } from '@angular/router';
import { TipoSuscripcion } from '../../../models/TipoSuscripcion';
import { TipoSuscripcionService } from '../../../services/tipo-suscripcion.service';
import { Usuarios } from '../../../models/Usuarios';
import { UsuariosService } from '../../../services/usuarios.service';

@Component({
  selector: 'app-insertar-tiposuscripcion',
  templateUrl: './insertar-tiposuscripcion.component.html',
  styleUrls: ['./insertar-tiposuscripcion.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    RouterLink
  ]
})
export class InsertarTiposuscripcionComponent implements OnInit {
  form: FormGroup;
  listaUsuarios: Usuarios[] = [];
  tiposuscripcion: TipoSuscripcion = new TipoSuscripcion();
  id: number = 0;
  edicion: boolean = false;

  constructor(
    private tS: TipoSuscripcionService,
    private uS: UsuariosService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.form = this.formBuilder.group({
      idSuscription: [''],
      nameSuscription: ['', Validators.required],
      descriptionSuscription: ['', Validators.required],
      startDateSuscription: ['', Validators.required],
      endDateSuscription: ['', Validators.required],
      users: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.init();
    });

    this.uS.list().subscribe(data => {
      this.listaUsuarios = data;
    });
  }

  init(): void {
    if (this.edicion) {
      this.tS.listId(this.id).subscribe(data => {
        this.form.patchValue({
          idSuscription: data.idSuscription,
          nameSuscription: data.nameSuscription,
          descriptionSuscription: data.descriptionSuscription,
          startDateSuscription: data.startDateSuscription,
          endDateSuscription: data.endDateSuscription,
          users: data.users
        });
      });
    }
  }

  aceptar(): void {
    if (this.form.valid) {
      this.tiposuscripcion.idSuscription = this.form.value.idSuscription;
      this.tiposuscripcion.nameSuscription = this.form.value.nameSuscription;
      this.tiposuscripcion.descriptionSuscription = this.form.value.descriptionSuscription;
      this.tiposuscripcion.startDateSuscription = this.form.value.startDateSuscription;
      this.tiposuscripcion.endDateSuscription = this.form.value.endDateSuscription;
      this.tiposuscripcion.users = this.form.value.users;

      if (this.edicion) {
        this.tS.update(this.tiposuscripcion).subscribe(() => {
          this.tS.list().subscribe(data => {
            this.tS.setList(data);
          });
        });
      } else {
        this.tS.insert(this.tiposuscripcion).subscribe(() => {
          this.tS.list().subscribe(data => {
            this.tS.setList(data);
          });
        });
      }
      this.router.navigate(['/tiposuscripcion/listar']);
    }
  }
}
