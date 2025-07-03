import {Usuarios} from './Usuarios';

export class Mapacalor{
  idmapacalor :number=0
  latitud :number=0
  longitud :number=0
  nivelriesgo :string=""
  fechaactualizacion :Date=new Date()
  concentraciondecalor :number=0
  usuarios:Usuarios = new Usuarios()
}
