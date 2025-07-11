import { Injectable } from '@angular/core';
import { Usuarios } from '../models/Usuarios';
import { Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import {DistribuciondesuscriptoresuruarioDTO} from '../models/distribuciondesuscriptoresuruarioDTO';
import {EstadisticasporusuariocalorDTO} from '../models/EstadisticasporusuariocalorDTO';

const base_url = environment.base;

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private listaCambio = new Subject<Usuarios[]>();
  private url = `${base_url}/usuarios`;

  constructor(private http: HttpClient) { }

  list(): Observable<Usuarios[]> {
    return this.http.get<Usuarios[]>(this.url); // ← GET /usuarios
  }

  insert(u: Usuarios): Observable<any> {
    return this.http.post(this.url, u); // ← POST /usuarios
  }

  setList(listaNueva: Usuarios[]): void {
    this.listaCambio.next(listaNueva);
  }

  getList(): Observable<Usuarios[]> {
    return this.listaCambio.asObservable();
  }

  listId(id: number): Observable<Usuarios> {
    return this.http.get<Usuarios>(`${this.url}/${id}`); // ← GET /usuarios/{id}
  }

  update(u: Usuarios): Observable<any> {
    return this.http.put(this.url, u); // ← PUT /usuarios
  }

  deleteA(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`); // ← DELETE /usuarios/{id}
  }

  getdistribucion(): Observable<DistribuciondesuscriptoresuruarioDTO[]>{
      return this.http.get<DistribuciondesuscriptoresuruarioDTO[]>(`${this.url}/distribuciondesuscriptoresuruario`);
  }

  getestadisticas(): Observable<EstadisticasporusuariocalorDTO[]> {
    return this.http.get<EstadisticasporusuariocalorDTO[]>(`${this.url}/estadisticasporusuariocalor`);
  }
}
