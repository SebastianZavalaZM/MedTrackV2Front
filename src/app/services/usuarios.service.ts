import { Injectable } from '@angular/core';
import { Usuarios} from '../models/Usuarios';
import { Subject} from 'rxjs';
import { HttpClient} from '@angular/common/http';
import { environment} from '../../environments/environment';
const base_url = environment.base
@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private listaCambio = new Subject<Usuarios[]>()

  private url = `${base_url}/usuarios`

  constructor(private http: HttpClient) { }

  list() {
    return this.http.get<Usuarios[]>(this.url)
  }
  insert(u: Usuarios) {
    return this.http.post(this.url, u)
  }

  setList(listaNueva: Usuarios[]) {
    this.listaCambio.next(listaNueva)
  }
  getList() {
    return this.listaCambio.asObservable()
  }

  listId(id: number) {
    return this.http.get<Usuarios>(`${this.url}/${id}`)
  }

  update(u: Usuarios) {
    return this.http.put(this.url, u)
  }

  deleteA(id:number) {
    return this.http.delete(`${this.url}/${id}`)
  }

}
