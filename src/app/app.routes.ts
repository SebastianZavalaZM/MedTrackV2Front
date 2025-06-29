import { Routes } from '@angular/router';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { InsertareditarComponent } from './components/usuarios/insertareditar/insertareditar.component';
import { InsertareditarforosComponent } from './components/foros/insertareditarforos/insertareditarforos.component';
import { InsertareditarcomentarioforosComponent } from './components/comentarioforos/insertareditarcomentarioforos/insertareditarcomentarioforos.component';
import { ForosComponent } from './components/foros/foros.component';
import { ComentarioforosComponent } from './components/comentarioforos/comentarioforos.component';

export const routes: Routes = [
  {
    path:'',redirectTo:'usuarios',pathMatch:'full'
  },
  {
    path:'usuarios',component:UsuariosComponent,
    children:[
      {
        path:'formulario',component:InsertareditarComponent
      },
      {
        path:'ediciones/:id',component:InsertareditarComponent
      }
    ]
  },
  {
    path: 'Foros', component:ForosComponent,
    children: [
      { 
        path: 'formularioforo', component:InsertareditarforosComponent 
      },
      { 
        path: 'edicionesforo/:id', component:InsertareditarforosComponent
      }
    ]
  },
  {
    path: 'Comentarios', component:ComentarioforosComponent,
    children: [
      { 
      path: 'formulariocomentario', component:InsertareditarcomentarioforosComponent
      },
      { 
      path: 'edicionescomentario/:id', component:InsertareditarcomentarioforosComponent
      }
    ]
  }
];
