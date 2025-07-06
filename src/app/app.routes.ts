import { Routes } from '@angular/router';
import {UsuariosComponent} from './components/usuarios/usuarios.component';
import {InsertareditarComponent} from './components/usuarios/insertareditar/insertareditar.component';
import { BuscarPorCiudadOenfermedadComponent } from './components/reporteciudadano/buscar-por-ciudad-oenfermedad/buscar-por-ciudad-oenfermedad.component';
import { InsertareditarrcComponent } from './components/reporteciudadano/insertareditarrc/insertareditarrc.component';
import { ReporteciudadanoComponent } from './components/reporteciudadano/reporteciudadano.component';
import { ArticuloinformativoComponent } from './components/articuloinformativo/articuloinformativo.component';
import { InsertareditaraiComponent } from './components/articuloinformativo/insertareditarai/insertareditarai.component';
import { BuscartituloComponent } from './components/articuloinformativo/buscartitulo/buscartitulo.component';

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
    path: 'articuloinformativo/listas', component: ArticuloinformativoComponent,
    children: [
      {
        path:'formulario',component:InsertareditaraiComponent
      },
      {
        path:'ediciones/:id',component:InsertareditaraiComponent
      },
       {
        path:'buscartitulo',component:BuscartituloComponent
      }

    ]
  },
  {
    path: 'reporteciudadano/listas', component: ReporteciudadanoComponent,
    children: [
      {
        path:'formulario',component:InsertareditarrcComponent
      },
      {
        path:'ediciones/:id',component:InsertareditarrcComponent
      },
       {
        path:'buscarPorCiudadOEnfermedad',component:BuscarPorCiudadOenfermedadComponent
      }

    ]
  }

];
