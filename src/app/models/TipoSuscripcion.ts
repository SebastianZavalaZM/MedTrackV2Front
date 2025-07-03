import { Usuarios } from './Usuarios';

export class TipoSuscripcion {
  id?: number;
  codigo: string = '';
  descripcion: string = '';
  fechaInicio: string = '';
  fechaFin: string = '';
  usuario?: Usuarios;
}