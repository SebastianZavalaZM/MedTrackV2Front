import { Routes } from '@angular/router';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { InsertareditarComponent } from './components/usuarios/insertareditar/insertareditar.component';
import { InsertareditarforosComponent } from './components/foros/insertareditarforos/insertareditarforos.component';
import { InsertareditarcomentarioforosComponent } from './components/comentarioforos/insertareditarcomentarioforos/insertareditarcomentarioforos.component';
import { ForosComponent } from './components/foros/foros.component';
import { ComentarioforosComponent } from './components/comentarioforos/comentarioforos.component';
import { BuscarforoComponent } from './components/comentarioforos/buscarforo/buscarforo.component';
import { BuscarporperiodoComponent } from './components/foros/buscarporperiodo/buscarporperiodo.component';
import { LoginComponent } from './components/login/login.component';
import { seguridadGuard } from './guard/seguridad.guard';

export const routes: Routes = [
 {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'usuarios',
    component: UsuariosComponent,
    canActivate: [seguridadGuard],
    children: [
      {
        path: 'formulario',
        component: InsertareditarComponent,
      },
      {
        path: 'ediciones/:id',
        component: InsertareditarComponent,
      },
    ],
  },
  {
    path: 'Foros',
    component: ForosComponent,
    canActivate: [seguridadGuard],
    children: [
      {
        path: 'formularioforo',
        component: InsertareditarforosComponent,
      },
      {
        path: 'edicionesforo/:id',
        component: InsertareditarforosComponent,
      },
      {
        path: 'buscarporperiodo',
        component: BuscarporperiodoComponent,
      },
    ],
  },
  {
    path: 'Comentarios',
    component: ComentarioforosComponent,
    canActivate: [seguridadGuard],
    children: [
      {
        path: 'formulariocomentario',
        component: InsertareditarcomentarioforosComponent,
      },
      {
        path: 'edicionescomentario/:id',
        component: InsertareditarcomentarioforosComponent,
      },
      {
        path: 'busquedatituloforo',
        component: BuscarforoComponent,
      },
    ],
  },
  // Ruta para errores o páginas no encontradas (opcional)
  {
    path: '**',
    redirectTo: 'login',
  },
];
