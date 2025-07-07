import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Foros } from '../models/Foros';
const base_url = environment.base

@Injectable({
  providedIn: 'root'
})
export class ForosService {
  
  private url = `${base_url}/Foros`
  private listaCambio = new Subject<Foros[]>()

  constructor(private http: HttpClient) { }

  list() {
    return this.http.get<Foros[]>(`${this.url}/Listar`)
  }

  insert(f: Foros) {
  return this.http.post(`${this.url}/Registrar`, f)
  }

  setList(listaNueva: Foros[]) {
    this.listaCambio.next(listaNueva)
  }
  
  getList() {
    return this.listaCambio.asObservable()
  }

  listId(id: number) {
    return this.http.get<Foros>(`${this.url}/${id}`)
  }

  update(f: Foros) {
    return this.http.put(`${this.url}/Modificar`, f)
  }

  deleteF(id: number) {
    return this.http.delete(`${this.url}/${id}`)
  }

  buscarPorPeriodo(fechaInicio: string, fechaFin: string) {
    return this.http.get<Foros[]>(`${this.url}/ListarPorPeriodo`, {
      params: {
        fechaInicio: fechaInicio,
        fechaFin: fechaFin
      }
    });
  }
}