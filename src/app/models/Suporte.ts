import { Usuarios } from './Usuarios';

export class Suporte {
  idsuporte?: number;
  titulo: string = '';
  fecha: string = '';
  descripcion: string = '';
  users?: Usuarios;
}