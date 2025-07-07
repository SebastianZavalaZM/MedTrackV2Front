import { Usuarios } from "./Usuarios";

export class TipoEnfermedad {
  idTipo: number = 0
  nombre: string = ""
  descripcion: string = ""
  users: Usuarios = new Usuarios();
}