import { Usuarios } from "../models/Usuarios"
import { Foros } from "../models/Foros"

export class ComenarioForos {
    id: number = 0;
    contenido: string = '';
    fechaComentario: Date = new Date();
    forums: Foros = new Foros();
    users: Usuarios = new Usuarios();
}
