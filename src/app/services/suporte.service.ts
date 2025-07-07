import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Suporte } from '../models/Suporte';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SuporteService {
  private url = `${environment.base}/suportes`;
  private listaCambio = new Subject<Suporte[]>();

  constructor(private http: HttpClient) {}

  list(): Observable<Suporte[]> {
    return this.http.get<Suporte[]>(`${this.url}/listas`);
  }

  insert(suporte: Suporte): Observable<void> {
    return this.http.post<void>(`${this.url}/registra`, suporte); 
  }

  listId(id: number): Observable<Suporte> {
    return this.http.get<Suporte>(`${this.url}/${id}`);
  }

  update(suporte: Suporte): Observable<void> {
    return this.http.put<void>(this.url, suporte); 
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`); 
  }

  setList(listaNueva: Suporte[]) {
    this.listaCambio.next(listaNueva);
  }

  getList(): Observable<Suporte[]> {
    return this.listaCambio.asObservable();
  }
}