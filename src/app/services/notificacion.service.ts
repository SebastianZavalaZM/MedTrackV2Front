import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {environment} from '../../environments/environment';
import {Notificacion} from '../models/notificacion';
import {HttpClient} from '@angular/common/http';
const base_url = environment.base;
@Injectable({
  providedIn: 'root'
})
export class NotificacionService {

  private url = `${base_url}/notification`;
  private listaCambio = new Subject<Notificacion[]>();

  constructor(private http: HttpClient) { }

  list() {
    return this.http.get<Notificacion[]>(`${this.url}/listas`);
  }
  insert(n: Notificacion) {
    return this.http.post(`${this.url}/registra`, n);
  }
  setList(listaNueva: Notificacion[]) {
    this.listaCambio.next(listaNueva);
  }
  getList() {
    return this.listaCambio.asObservable();
  }
  listId(id: number) {
    return this.http.get<Notificacion>(`${this.url}/${id}`);
  }
  update(n: Notificacion) {
    return this.http.put(this.url, n);
  }
  deleteN(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }
}
