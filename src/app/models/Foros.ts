import { Usuarios } from "../models/Usuarios"

export class Foros {
    idforum: number = 0;
    titulo: string = '';
    descripcion: string = '';
    fechacreacion: Date = new Date();
    users: Usuarios = new Usuarios();
}
