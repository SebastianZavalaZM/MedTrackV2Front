import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Reporteciudadano } from '../models/reporteciudadano';
import { Subject } from 'rxjs';
const base_url = environment.base
@Injectable({
  providedIn: 'root'
})
export class ReporteciudadanoService {

  private listaCambio = new Subject<Reporteciudadano[]>()
  
    private url = `${base_url}/reporteciudadano`
  
    constructor(private http: HttpClient) { }
  
    list() {
      return this.http.get<Reporteciudadano[]>(this.url)
    }
    insert(u: Reporteciudadano) {
      return this.http.post(this.url, u)
    }
  
    setList(listaNueva: Reporteciudadano[]) {
      this.listaCambio.next(listaNueva)
    }
    getList() {
      return this.listaCambio.asObservable()
    }
  
    listId(id: number) {
      return this.http.get<Reporteciudadano>(`${this.url}/${id}`)
    }
  
    update(u: Reporteciudadano) {
      return this.http.put(this.url, u)
    }
  
    deleteA(id:number) {
      return this.http.delete(`${this.url}/${id}`)
    }
}
