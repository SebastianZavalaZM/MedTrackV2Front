import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { TipoEnfermedad } from '../models/tipoenfermedad';
import { Subject } from 'rxjs';

const base_url = environment.base

@Injectable({
  providedIn: 'root'
})
export class TipoenfermedadService {

  private listaCambio = new Subject<TipoEnfermedad[]>()

  private url = `${base_url}tipoenfermedades`; 

  constructor(private http: HttpClient) { }

  list() {
    return this.http.get<TipoEnfermedad[]>(`${this.url}/listas`);
  }
  insert(t: TipoEnfermedad) {
  return this.http.post(`${this.url}/registra`, t);
  }

  setList(listaNueva: TipoEnfermedad[]) {
    this.listaCambio.next(listaNueva)
  }
  getList() {
    return this.listaCambio.asObservable()
  }

  listId(id: number) {
    return this.http.get<TipoEnfermedad>(`${this.url}/${id}`);
  }

  update(t: TipoEnfermedad) {
    return this.http.put(this.url, t);
  }

  deleteS(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }

  searchNombre(p: string) {
    const params = { palabra: p };
    return this.http.get<TipoEnfermedad[]>(`${this.url}/buscarPorNombre`, { params });
  }

  
}
