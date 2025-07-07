import { Enfermedad } from "./enfermedad";
import { Usuarios } from "../models/Usuarios"

export class Reporteciudadano {
    id_reporte_ciudadano: number = 0;
    fechaReporte: Date = new Date();
    cuidad: string = '';
    enfermedad: Enfermedad = new Enfermedad();
    users: Usuarios = new Usuarios();
}
