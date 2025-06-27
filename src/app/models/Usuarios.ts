export class Usuarios {
  idUsers: number = 0;
  username: string = '';
  correo: string = '';
  password: string = '';
  fecharegistro: Date = new Date();
  ubicacion: string = '';
  longitudUsuario: number = 0;
  latitudUsuario: number = 0;
  enabled?: boolean;
}
