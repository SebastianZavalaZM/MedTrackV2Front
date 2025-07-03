import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Suporte } from '../models/Suporte';
import { Observable,Subject } from 'rxjs';

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
      return this.http.post<void>(this.url, suporte);
    }
  
    setList(listaNueva: Suporte[]) {
      this.listaCambio.next(listaNueva);
    }
  
    getList() {
      return this.listaCambio.asObservable();
    }
  }