import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Reporteciudadano } from '../models/reporteciudadano';
import { Subject, Observable } from 'rxjs';

const base_url = environment.base;

@Injectable({
  providedIn: 'root'
})
export class ReporteciudadanoService {

  private listaCambio = new Subject<Reporteciudadano[]>();
  private url = `${base_url}/reporteciudadano/listas`;

  constructor(private http: HttpClient) {}

  list(): Observable<Reporteciudadano[]> {
    return this.http.get<Reporteciudadano[]>(this.url);
  }

  insert(u: Reporteciudadano): Observable<any> {
    return this.http.post(this.url, u);
  }

  setList(listaNueva: Reporteciudadano[]) {
    this.listaCambio.next(listaNueva);
  }

  getList(): Observable<Reporteciudadano[]> {
    return this.listaCambio.asObservable();
  }

  listId(id: number): Observable<Reporteciudadano> {
    return this.http.get<Reporteciudadano>(`${this.url}/${id}`);
  }

  update(u: Reporteciudadano): Observable<any> {
    return this.http.put(this.url, u);
  }

  deleteA(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }

  // 🔍 Buscar por ciudad o enfermedad (según controller)
  buscarPorCiudadOEnfermedad(cuidad: string, enfermedad: string): Observable<Reporteciudadano[]> {
    return this.http.get<Reporteciudadano[]>(`${this.url}/buscarPorCiudadOEnfermedad`, {
      params: {
        cuidad: cuidad, // cuidad: el param en backend es "cuidad"
        enfermedad: enfermedad
      }
    });
  }
}
