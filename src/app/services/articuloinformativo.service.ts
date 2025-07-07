import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Articuloinformativo } from '../models/articuloinformativo';
import { Subject, Observable } from 'rxjs';

const base_url = environment.base;

@Injectable({
  providedIn: 'root'
})
export class ArticuloinformativoService {

  private listaCambio = new Subject<Articuloinformativo[]>();
  private url = `${base_url}/articuloinformativo/listas`;

  constructor(private http: HttpClient) {}

  list(): Observable<Articuloinformativo[]> {
    return this.http.get<Articuloinformativo[]>(this.url);
  }

  insert(a: Articuloinformativo): Observable<any> {
    return this.http.post(this.url, a);
  }

  setList(listaNueva: Articuloinformativo[]) {
    this.listaCambio.next(listaNueva);
  }

  getList(): Observable<Articuloinformativo[]> {
    return this.listaCambio.asObservable();
  }

  listId(id: number): Observable<Articuloinformativo> {
    return this.http.get<Articuloinformativo>(`${this.url}/${id}`);
  }

  update(a: Articuloinformativo): Observable<any> {
    return this.http.put(this.url, a);
  }

  deleteA(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }

  // 🔍 Buscar por título o contenido
  buscarPorTituloOContenido(keyword: string): Observable<Articuloinformativo[]> {
    return this.http.get<Articuloinformativo[]>(`${this.url}/buscartitulo`, {
      params: { keyword }
    });
  }

  // 📋 Listar artículos con reportes
  listarConReportes(): Observable<Articuloinformativo[]> {
    return this.http.get<Articuloinformativo[]>(`${this.url}/listarreportes`);
  }
}
