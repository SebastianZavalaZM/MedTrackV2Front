import { Usuarios } from './Usuarios';

export class Suporte {
  idsuporte: number = 0;
  titulo: string = '';
  fecha: Date = new Date();
  descripcion: string = '';
  users: Usuarios = new Usuarios();
}