import { Injectable } from '@angular/core';
import { Mapacalor} from '../models/mapacalor';
import { HttpClient } from '@angular/common/http';
import { Subject} from 'rxjs';
import { environment} from '../../environments/environment';
const base_url = environment.base;

@Injectable({
  providedIn: 'root'
})
export class MapacalorService {

  private url = `${base_url}/mapacalor`;
  private listaCambio = new Subject<Mapacalor[]>();

  constructor(private http: HttpClient) { }

  list() {
    return this.http.get<Mapacalor[]>(`${this.url}/listas`);
  }

  insert(m: Mapacalor) {
    return this.http.post(`${this.url}/registra`, m);
  }

  setList(listaNueva: Mapacalor[]) {
    this.listaCambio.next(listaNueva);
  }
  getList() {
    return this.listaCambio.asObservable();
  }

  listId(id: number) {
    return this.http.get<Mapacalor>(`${this.url}/${id}`)
  }

  update(m: Mapacalor) {
    return this.http.put(this.url, m)
  }

  deleteM(id:number) {
    return this.http.delete(`${this.url}/${id}`)
  }


}
