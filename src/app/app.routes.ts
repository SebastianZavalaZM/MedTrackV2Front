import { Routes } from '@angular/router';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { InsertareditarComponent } from './components/usuarios/insertareditar/insertareditar.component';
import { ListarforosComponent } from './components/foros/listarforos/listarforos.component';
import { InsertareditarforosComponent } from './components/foros/insertareditarforos/insertareditarforos.component';
import { ListarcomentarioforosComponent } from './components/comentarioforos/listarcomentarioforos/listarcomentarioforos.component';
import { InsertareditarcomentarioforosComponent } from './components/comentarioforos/insertareditarcomentarioforos/insertareditarcomentarioforos.component';

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
    path: 'Foros', component:ListarforosComponent,
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
    path: 'Comentarios', component:ListarcomentarioforosComponent,
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
