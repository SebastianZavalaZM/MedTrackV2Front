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
import { ListarTiposuscripcionComponent } from './components/tiposuscripcion/listar-tiposuscripcion/listar-tiposuscripcion.component';
import { InsertarTiposuscripcionComponent } from './components/tiposuscripcion/insertar-tiposuscripcion/insertar-tiposuscripcion.component';
import { ListarSuporteComponent } from './components/suporte/listar-suporte/listar-suporte.component';
import { InsertarSuporteComponent } from './components/suporte/insertar-suporte/insertar-suporte.component';

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
  },
  {
    path: 'tiposuscripcion',
    children: [
      { path: 'listar', component: ListarTiposuscripcionComponent },
      { path: 'insertar', component: InsertarTiposuscripcionComponent },
      { path: 'editar/:id', component: InsertarTiposuscripcionComponent },
      { path: '', redirectTo: 'listar', pathMatch: 'full' }
    ]
  },
  {
    path: 'soporte',
    children: [
      { path: 'listar', component: ListarSuporteComponent },
      { path: 'insertar', component: InsertarSuporteComponent },
      { path: 'editar/:id', component: InsertarSuporteComponent },
      { path: '', redirectTo: 'listar', pathMatch: 'full' }
    ]
  }


];
