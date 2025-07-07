import { Usuarios } from './Usuarios';

export class TipoSuscripcion {
  idSuscription?: number;
  nameSuscription: string = '';
  descriptionSuscription: string = '';
  startDateSuscription: string = '';
  endDateSuscription: string = '';
  users: Usuarios = new Usuarios();
}