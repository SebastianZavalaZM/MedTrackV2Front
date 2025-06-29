import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ComenarioForos } from '../models/ComentarioForos';
const base_url = environment.base

@Injectable({
  providedIn: 'root'
})
export class ComentarioforosService {

  private url = `${base_url}/Comentarios`
  private listaCambio = new Subject<ComenarioForos[]>()

  constructor(private http: HttpClient) { }

  list() {
    return this.http.get<ComenarioForos[]>(`${this.url}/Listar`)
  }

  insert(cf: ComenarioForos) {
    return this.http.post(`${this.url}/Registrar`, cf)
  }

  setList(listaNueva: ComenarioForos[]) {
    this.listaCambio.next(listaNueva)
  }
  
  getList() {
    return this.listaCambio.asObservable()
  }

  listId(id: number) {
    return this.http.get<ComenarioForos>(`${this.url}/${id}`)
  }

  update(cf: ComenarioForos) {
    return this.http.put(`${this.url}/Modificar`, cf)
  }

  deleteCF(id: number) {
    return this.http.delete(`${this.url}/${id}`)
  }

  buscarPorForo(nTitulo: string) {
    return this.http.get<ComenarioForos[]>(`${this.url}/buscarPorForo`, {
      params: { nTitulo: nTitulo }
    });
  } 
}
