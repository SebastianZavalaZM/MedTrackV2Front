import {Mapacalor} from './mapacalor';

export class Notificacion {
  idnotification: number=0;
  mensaje : string = '';
  fechaenvio : Date = new Date();
  tipo: string = '';
  origen: string = '';
  mapacalor:Mapacalor = new Mapacalor();
}
