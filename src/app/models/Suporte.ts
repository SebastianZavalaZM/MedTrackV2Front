import { Usuarios } from './Usuarios';

export class Suporte {
  idSuporte?: number;
  titulo: string = '';
  fecha: string = '';
  descripcion: string = '';
  users: Usuarios = new Usuarios();
}