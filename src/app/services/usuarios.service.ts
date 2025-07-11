// usuarios.service.ts - SOLO OpenStreetMap
import { Injectable } from '@angular/core';
import { Usuarios } from '../models/Usuarios';
import { Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import {DistribuciondesuscriptoresuruarioDTO} from '../models/distribuciondesuscriptoresuruarioDTO';
import {EstadisticasporusuariocalorDTO} from '../models/EstadisticasporusuariocalorDTO';

const base_url = environment.base;

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private listaCambio = new Subject<Usuarios[]>();
  private url = `${base_url}/usuarios`;

  constructor(private http: HttpClient) { }

  list(): Observable<Usuarios[]> {
    return this.http.get<Usuarios[]>(this.url); // ← GET /usuarios
  }

  insert(u: Usuarios): Observable<any> {
    return this.http.post(this.url, u); // ← POST /usuarios
  }

  setList(listaNueva: Usuarios[]): void {
    this.listaCambio.next(listaNueva);
  }

  getList(): Observable<Usuarios[]> {
    return this.listaCambio.asObservable();
  }

  listId(id: number): Observable<Usuarios> {
    return this.http.get<Usuarios>(`${this.url}/${id}`); // ← GET /usuarios/{id}
  }

  update(u: Usuarios): Observable<any> {
    return this.http.put(this.url, u); // ← PUT /usuarios
  }

  deleteA(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`); // ← DELETE /usuarios/{id}
  }
  getdistribucion(): Observable<DistribuciondesuscriptoresuruarioDTO[]>{
    return this.http.get<DistribuciondesuscriptoresuruarioDTO[]>(`${this.url}/distribuciondesuscriptoresuruario`);
  }

  getestadisticas(): Observable<EstadisticasporusuariocalorDTO[]> {
    return this.http.get<EstadisticasporusuariocalorDTO[]>(`${this.url}/estadisticasporusuariocalor`);
  }


  // 🆕 GPS CON PRECISIÓN - SOLO OpenStreetMap
  obtenerUbicacionConPrecision(): Promise<{
    latitude: number,
    longitude: number,
    direccion: string,
    precision: number,
    timestamp: number
  }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject('Geolocalización no soportada');
        return;
      }

      const opciones = {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0
      };

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const precision = position.coords.accuracy;
          const timestamp = position.timestamp;

          try {
            const direccion = await this.obtenerDireccionDesdeCoordendas(lat, lng);

            resolve({
              latitude: lat,
              longitude: lng,
              direccion: direccion,
              precision: precision,
              timestamp: timestamp
            });

          } catch (error) {
            console.warn('No se pudo obtener dirección, usando coordenadas:', error);
            resolve({
              latitude: lat,
              longitude: lng,
              direccion: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
              precision: precision,
              timestamp: timestamp
            });
          }
        },
        (error) => {
          reject(`Error GPS: ${error.message}`);
        },
        opciones
      );
    });
  }

  obtenerUbicacionGPS(): Promise<{latitude: number, longitude: number, direccion: string}> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject('Geolocalización no disponible en este navegador');
        return;
      }

      const opciones = {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 900000
      };

      console.log('🖥️ Obteniendo ubicación aproximada desde ordenador...');

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const precision = position.coords.accuracy;

          console.log(`📍 Ubicación obtenida - Precisión: ±${precision.toFixed(0)}m (vía WiFi/IP)`);

          try {
            const direccion = await this.obtenerDireccionDesdeCoordendas(lat, lng);

            resolve({
              latitude: lat,
              longitude: lng,
              direccion: direccion
            });

          } catch (error) {
            resolve({
              latitude: lat,
              longitude: lng,
              direccion: `${lat.toFixed(6)}, ${lng.toFixed(6)}`
            });
          }
        },
        (error) => {
          console.warn('🖥️ Geolocalización falló, usando mapa manual');

          let mensaje = '';
          switch(error.code) {
            case error.PERMISSION_DENIED:
              mensaje = 'Ubicación bloqueada. Permite ubicación en el navegador o selecciona manualmente.';
              break;
            case error.POSITION_UNAVAILABLE:
              mensaje = 'Ubicación no disponible. Selecciona tu ubicación en el mapa.';
              break;
            case error.TIMEOUT:
              mensaje = 'Tiempo agotado. Selecciona tu ubicación manualmente.';
              break;
            default:
              mensaje = 'Error de ubicación. Usa el mapa para seleccionar.';
          }

          reject(mensaje);
        },
        opciones
      );
    });
  }

  async obtenerDireccionDesdeCoordendas(lat: number, lng: number): Promise<string> {
    try {
      console.log('🌍 Usando OpenStreetMap Nominatim');

      // api openstreetmap
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'MedTrack-App/1.0'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data && data.display_name) {
        // Formatear la dirección para que sea más legible
        const address = data.address || {};

        let direccionFormateada = '';

        if (address.road) {
          direccionFormateada += address.road;
        }
        if (address.house_number) {
          direccionFormateada = address.house_number + ' ' + direccionFormateada;
        }
        if (address.neighbourhood || address.suburb) {
          direccionFormateada += ', ' + (address.neighbourhood || address.suburb);
        }
        if (address.city || address.town || address.village) {
          direccionFormateada += ', ' + (address.city || address.town || address.village);
        }
        if (address.state) {
          direccionFormateada += ', ' + address.state;
        }
        if (address.country) {
          direccionFormateada += ', ' + address.country;
        }

        // Si no se pudo formatear bien, usar la dirección completa
        return direccionFormateada.length > 10 ? direccionFormateada : data.display_name;
      }

      // Si no hay respuesta válida, devolver coordenadas
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

    } catch (error) {
      console.warn('Error en OpenStreetMap Nominatim:', error);

      // Sin API de respaldo - directamente coordenadas
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
  }

  esGPSDisponible(): boolean {
    return 'geolocation' in navigator;
  }


}
