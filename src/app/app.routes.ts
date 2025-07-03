import { Routes } from '@angular/router';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { InsertareditarComponent } from './components/usuarios/insertareditar/insertareditar.component';
import { ListarTiposuscripcionComponent } from './components/tiposuscripcion/listar-tiposuscripcion/listar-tiposuscripcion.component';
import { InsertarTiposuscripcionComponent } from './components/tiposuscripcion/insertar-tiposuscripcion/insertar-tiposuscripcion.component';
import { ListarSuporteComponent } from './components/suporte/listar-suporte/listar-suporte.component';
import { InsertarSuporteComponent } from './components/suporte/insertar-suporte/insertar-suporte.component';

export const routes: Routes = [
  {
    path: '', redirectTo: 'usuarios', pathMatch: 'full'
  },
  {
    path: 'usuarios', component: UsuariosComponent,
    children: [
      { path: 'formulario', component: InsertareditarComponent },
      { path: 'ediciones/:id', component: InsertareditarComponent }
    ]
  },
  {
    path: 'tiposuscripcion',
    children: [
      { path: 'listar', component: ListarTiposuscripcionComponent },
      { path: 'insertar', component: InsertarTiposuscripcionComponent },
      { path: '', redirectTo: 'listar', pathMatch: 'full' }
    ]
  },
  {
    path: 'soporte',
    children: [
      { path: 'listar', component: ListarSuporteComponent },
      { path: 'insertar', component: InsertarSuporteComponent },
      { path: '', redirectTo: 'listar', pathMatch: 'full' }
    ]
  }
];
