import { TipoEnfermedad } from "./tipoenfermedad";

export class Enfermedad {
  idEnfermedad: number = 0
  nombre: string = ""
  sintomas: string = ""
  nivelRiesgo: string = ""
  tipoEnfermedad: TipoEnfermedad = new TipoEnfermedad()
}