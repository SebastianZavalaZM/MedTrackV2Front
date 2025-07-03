import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { TipoSuscripcion } from '../models/TipoSuscripcion';
import { Observable,Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TipoSuscripcionService {
    private url = `${environment.base}/tipo_suscripcion`;
    private listaCambio = new Subject<TipoSuscripcion[]>();
  
    constructor(private http: HttpClient) {}
  
    list(): Observable<TipoSuscripcion[]> {
      return this.http.get<TipoSuscripcion[]>(this.url);
    }
  
    insert(tiposuscripcion: TipoSuscripcion): Observable<void> {
      return this.http.post<void>(this.url, tiposuscripcion);
    }
  
    setList(listaNueva: TipoSuscripcion[]) {
      this.listaCambio.next(listaNueva);
    }
  
    getList() {
      return this.listaCambio.asObservable();
    }
  }
  