import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { TipoSuscripcion } from '../models/TipoSuscripcion';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TipoSuscripcionService {
  private url = `${environment.base}/suscripciones`;
  private listaCambio = new Subject<TipoSuscripcion[]>();

  constructor(private http: HttpClient) {}

  list(): Observable<TipoSuscripcion[]> {
    return this.http.get<TipoSuscripcion[]>(`${this.url}/listar`);
  }

  insert(tiposuscripcion: TipoSuscripcion): Observable<void> {
    return this.http.post<void>(`${this.url}/registrar`, tiposuscripcion);
  }

  setList(listaNueva: TipoSuscripcion[]) {
    this.listaCambio.next(listaNueva);
  }

  getList(): Observable<TipoSuscripcion[]> {
    return this.listaCambio.asObservable();
  }
}