import { Routes } from '@angular/router';
import {UsuariosComponent} from './components/usuarios/usuarios.component';
import {InsertareditarComponent} from './components/usuarios/insertareditar/insertareditar.component';
import { TipoEnfermedadComponent } from './components/tipoenfermedad/tipoenfermedad.component';
import { InsertareditarteComponent } from './components/tipoenfermedad/insertareditar/insertareditar.component';
import { BuscarteComponent } from './components/tipoenfermedad/buscar/buscar.component';
import { EnfermedadComponent } from './components/enfermedad/enfermedad.component';
import { InsertareditareComponent } from './components/enfermedad/insertareditar/insertareditar.component';
import { ContadornvlriesgoComponent } from './components/enfermedad/contadornvlriesgo/contadornvlriesgo.component';
import {MapacalorComponent} from './components/mapacalor/mapacalor.component';
import {InsertareditarmcComponent} from './components/mapacalor/insertareditarmc/insertareditarmc.component';
import {NotificacionComponent} from './components/notificacion/notificacion.component';
import {InsertareditarnotComponent} from './components/notificacion/insertareditarnot/insertareditarnot.component';


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
    path:'tipoenfermedades/listas',component:TipoEnfermedadComponent,
    children:[
      {
        path:'formulario',component:InsertareditarteComponent
      },
      {
        path:'ediciones/:id',component:InsertareditarteComponent
      },
      {
        path:'buscarPorNombre',component:BuscarteComponent
      }

    ]
  },
  {
    path: 'enfermedades/listas', component: EnfermedadComponent,
    children: [
      {
        path:'formulario',component:InsertareditareComponent
      },
      {
        path:'ediciones/:id',component:InsertareditareComponent
      },
       {
        path:'contar-nivel-riesgo',component:ContadornvlriesgoComponent
      }

    ]
  },
  {
    path: 'mapacalor/listas', component: MapacalorComponent,
    children:[
      {
        path:'formulario',component:InsertareditarmcComponent,
      },
      {
        path:'ediciones/:id',component:InsertareditarmcComponent
      }
    ]
  },
  {
    path: 'notification/listas', component: NotificacionComponent,
    children:[
      {
        path:'formulario',component:InsertareditarnotComponent,
      },
      {
        path:'ediciones/:id',component:InsertareditarnotComponent
      }
    ]
  }



];
