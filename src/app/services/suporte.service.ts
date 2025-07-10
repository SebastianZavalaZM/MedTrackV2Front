import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Suporte } from '../models/Suporte';
import { Subject } from 'rxjs';

const base_url = environment.base;

@Injectable({
  providedIn: 'root'
})
export class SuporteService {

  private listaCambio = new Subject<Suporte[]>();
  private url = `${base_url}/suportes`;

  constructor(private http: HttpClient) { }

  list() {
    return this.http.get<Suporte[]>(`${this.url}/listas`);
  }

  insert(s: Suporte) {
    return this.http.post(`${this.url}/registra`, s);
  }

  setList(listaNueva: Suporte[]) {
    this.listaCambio.next(listaNueva);
  }

  getList() {
    return this.listaCambio.asObservable();
  }

  listId(id: number) {
    return this.http.get<Suporte>(`${this.url}/${id}`);
  }

  update(s: Suporte) {
    return this.http.put(this.url, s);
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }

 searchUsuario(idUsuario: number) {
  return this.http.get<Suporte[]>(`${this.url}/buscar-usuario?idUsuario=${idUsuario}`);
}

searchFecha(fechaDesde: string, fechaHasta: string) {
  return this.http.get<Suporte[]>(`${this.url}/buscar-fechas?startDate=${fechaDesde}&endDate=${fechaHasta}`);
}
}