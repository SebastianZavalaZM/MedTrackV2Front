import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Articuloinformativo } from '../models/articuloinformativo';
import { Subject } from 'rxjs';
const base_url = environment.base
@Injectable({
  providedIn: 'root'
})
export class ArticuloinformativoService {

  private listaCambio = new Subject<Articuloinformativo[]>()
  
    private url = `${base_url}/articuloinformativo`
  
    constructor(private http: HttpClient) { }
  
    list() {
      return this.http.get<Articuloinformativo[]>(this.url)
    }
    insert(u: Articuloinformativo) {
      return this.http.post(this.url, u)
    }
  
    setList(listaNueva: Articuloinformativo[]) {
      this.listaCambio.next(listaNueva)
    }
    getList() {
      return this.listaCambio.asObservable()
    }
  
    listId(id: number) {
      return this.http.get<Articuloinformativo>(`${this.url}/${id}`)
    }
  
    update(u: Articuloinformativo) {
      return this.http.put(this.url, u)
    }
  
    deleteA(id:number) {
      return this.http.delete(`${this.url}/${id}`)
    }
}
