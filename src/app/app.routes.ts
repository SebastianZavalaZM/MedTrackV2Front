import { Routes } from '@angular/router';
import { UsuariosComponent} from './components/usuarios/usuarios.component';
import { InsertareditarComponent} from './components/usuarios/insertareditar/insertareditar.component';
import { TipoEnfermedadComponent } from './components/tipoenfermedad/tipoenfermedad.component';
import { InsertareditarteComponent } from './components/tipoenfermedad/insertareditar/insertareditar.component';
import { BuscarteComponent } from './components/tipoenfermedad/buscar/buscar.component';
import { EnfermedadComponent } from './components/enfermedad/enfermedad.component';
import { InsertareditareComponent } from './components/enfermedad/insertareditar/insertareditar.component';
import { ContadornvlriesgoComponent } from './components/enfermedad/contadornvlriesgo/contadornvlriesgo.component';
import { MapacalorComponent} from './components/mapacalor/mapacalor.component';
import { InsertareditarmcComponent} from './components/mapacalor/insertareditarmc/insertareditarmc.component';
import { NotificacionComponent} from './components/notificacion/notificacion.component';
import { InsertareditarnotComponent} from './components/notificacion/insertareditarnot/insertareditarnot.component';
import { ListarTiposuscripcionComponent } from './components/tiposuscripcion/listar-tiposuscripcion/listar-tiposuscripcion.component';
import { InsertarTiposuscripcionComponent } from './components/tiposuscripcion/insertar-tiposuscripcion/insertar-tiposuscripcion.component';
import { ListarSuporteComponent } from './components/suporte/listar-suporte/listar-suporte.component';
import { InsertarSuporteComponent } from './components/suporte/insertar-suporte/insertar-suporte.component';
import { BuscarPorCiudadOenfermedadComponent } from './components/reporteciudadano/buscar-por-ciudad-oenfermedad/buscar-por-ciudad-oenfermedad.component';
import { InsertareditarrcComponent } from './components/reporteciudadano/insertareditarrc/insertareditarrc.component';
import { ReporteciudadanoComponent } from './components/reporteciudadano/reporteciudadano.component';
import { ArticuloinformativoComponent } from './components/articuloinformativo/articuloinformativo.component';
import { InsertareditaraiComponent } from './components/articuloinformativo/insertareditarai/insertareditarai.component';
import { BuscartituloComponent } from './components/articuloinformativo/buscartitulo/buscartitulo.component';
import { InsertareditarforosComponent } from './components/foros/insertareditarforos/insertareditarforos.component';
import { InsertareditarcomentarioforosComponent } from './components/comentarioforos/insertareditarcomentarioforos/insertareditarcomentarioforos.component';
import { ForosComponent } from './components/foros/foros.component';
import { ComentarioforosComponent } from './components/comentarioforos/comentarioforos.component';
import { BuscarforoComponent } from './components/comentarioforos/buscarforo/buscarforo.component';
import { BuscarporperiodoComponent } from './components/foros/buscarporperiodo/buscarporperiodo.component';
import { LoginComponent } from './components/login/login.component';
import { seguridadGuard } from './guard/seguridad.guard';
import { HomeComponent } from './components/home/home.component';
import { SuporteComponent } from './components/suporte/suporte.component';
import { BuscarUsuarioSuporteComponent } from './components/suporte/buscar-usuario-suporte/buscar-usuario-suporte.component';
import { BuscarFechaSuporteComponent } from './components/suporte/buscar-fecha-suporte/buscar-fecha-suporte.component';
import { ReportesComponent} from './components/reportes/reportes.component';
import { Reporte1Component} from './components/reportes/reporte1/reporte1.component';
import { Reporte2Component} from './components/reportes/reporte2/reporte2.component';
import { Reporte3Component} from './components/reportes/reporte3/reporte3.component';
import {MapasdecalorComponent} from './components/mapacalor/mapasdecalor/mapasdecalor.component';

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
    path:'usuarios',component:UsuariosComponent,
    children:[
      {
        path:'formulario',component:InsertareditarComponent
      },
      {
        path:'ediciones/:id',component:InsertareditarComponent,
      }
    ],
    canActivate: [seguridadGuard],
  },
  {
    path:'tipoenfermedades/listas',component:TipoEnfermedadComponent,
    children:[
      {
        path:'formulario',component:InsertareditarteComponent
      },
      {
        path:'ediciones/:id',component:InsertareditarteComponent,
      },
      {
        path:'buscarPorNombre',component:BuscarteComponent
      }

    ],
    canActivate: [seguridadGuard],
  },
  {
    path: 'enfermedades/listas', component: EnfermedadComponent,
    canActivate: [seguridadGuard],
    data: { roles: ['ADMIN'] },
    children: [
      {
        path:'formulario',component:InsertareditareComponent
      },
      {
        path:'ediciones/:id',component:InsertareditareComponent,
      },
      {
        path:'contar-nivel-riesgo',component:ContadornvlriesgoComponent
      }

    ],

  },
  {
    path: 'mapacalor/listas', component: MapacalorComponent,
    children:[
      {
        path:'formulario',component:InsertareditarmcComponent,
      },
      {
        path:'ediciones/:id',component:InsertareditarmcComponent,
      }
    ],
    canActivate: [seguridadGuard],
  },
  {
    path: 'notification/listas', component: NotificacionComponent,
    children: [
      {
        path: 'formulario', component: InsertareditarnotComponent,
      },
      {
        path: 'ediciones/:id', component: InsertareditarnotComponent,
      }
    ],
    canActivate: [seguridadGuard],
  },
  {
    path: 'tiposuscripcion',
    children: [
      { path: 'listar', component: ListarTiposuscripcionComponent },
      { path: 'insertar', component: InsertarTiposuscripcionComponent },
      { path: 'editar/:id', component: InsertarTiposuscripcionComponent },
      { path: '', redirectTo: 'listar', pathMatch: 'full' }
    ],
    canActivate: [seguridadGuard],
  },
  {
    path: 'soporte',
    component: SuporteComponent,
    children: [
      { path: 'listar', component: ListarSuporteComponent },
      { path: 'insertar', component: InsertarSuporteComponent },
      { path: 'editar/:id', component: InsertarSuporteComponent},
      { path: 'buscar-usuario', component: BuscarUsuarioSuporteComponent },
      { path: 'buscar-fecha', component: BuscarFechaSuporteComponent },
      { path: '', redirectTo: 'listar', pathMatch: 'full' }
    ],
    canActivate: [seguridadGuard]
  },
  {
    path: 'articuloinformativo/listas', component: ArticuloinformativoComponent,
    children: [
      {
        path:'formulario',component:InsertareditaraiComponent
      },
      {
        path:'ediciones/:id',component:InsertareditaraiComponent,
      },
      {
        path:'buscartitulo',component:BuscartituloComponent
      }

    ],
    canActivate: [seguridadGuard],
  },
  {
    path: 'reporteciudadano/listas', component: ReporteciudadanoComponent,
    children: [
      {
        path:'formulario',component:InsertareditarrcComponent
      },
      {
        path:'ediciones/:id',component:InsertareditarrcComponent,

      },
      {
        path:'buscarPorCiudadOEnfermedad',component:BuscarPorCiudadOenfermedadComponent
      }

    ],
    canActivate: [seguridadGuard],
  },
  {
    path: 'Foros', component:ForosComponent,
    children: [
      {
        path: 'formularioforo', component:InsertareditarforosComponent
      },
      {
        path: 'edicionesforo/:id', component:InsertareditarforosComponent,
      },
      {
        path: 'buscarporperiodo', component: BuscarporperiodoComponent
      }
    ],
    canActivate: [seguridadGuard],
  },
  {
    path: 'Comentarios', component:ComentarioforosComponent,
    children: [
      {
        path: 'formulariocomentario', component:InsertareditarcomentarioforosComponent
      },
      {
        path: 'edicionescomentario/:id', component:InsertareditarcomentarioforosComponent,
      },
      {
        path: 'busquedatituloforo', component:BuscarforoComponent
      }
    ]
  },
  {
    path: 'reportes',
    component: ReportesComponent,
    children: [
      {
        path: 'estadisticas',
        component:Reporte1Component,
      },
      {
        path: 'estadisticas2',
        component:Reporte2Component,
      },
      {
        path: 'tipoenfermedad',
        component:Reporte3Component,
      }
      ],

  },
  {
    path: 'homes',
    component: HomeComponent,
        canActivate: [seguridadGuard],

  },
  {
    path: 'mapacalor/mapasdecalor',
    component: MapasdecalorComponent,
    canActivate: [seguridadGuard]
  },
];
