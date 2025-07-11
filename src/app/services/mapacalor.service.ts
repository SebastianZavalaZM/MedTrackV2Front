// mapacalor.service.ts - AGREGAR MÉTODO GPS FALTANTE
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
    return this.http.get<Mapacalor>(`${this.url}/${id}`);
  }

  update(m: Mapacalor) {
    return this.http.put(this.url, m);
  }

  deleteM(id:number) {
    return this.http.delete(`${this.url}/${id}`);
  }

  obtenerUbicacionGPS(): Promise<{latitude: number, longitude: number, direccion: string}> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject('Geolocalización no soportada por este navegador');
        return;
      }

      console.log('🛰️ Obteniendo GPS para mapa de calor...');

      const opciones = {
        enableHighAccuracy: false,  
        timeout: 10000,            
        maximumAge: 600000
      };

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const precision = position.coords.accuracy;
          
          console.log(`📍 GPS mapa de calor obtenido - Lat: ${lat}, Lng: ${lng}, Precisión: ±${precision.toFixed(0)}m`);
          
          try {
            const direccion = await this.obtenerDireccionDesdeCoordendas(lat, lng);
            resolve({
              latitude: lat,
              longitude: lng,
              direccion: direccion
            });
          } catch (error) {
            console.warn('No se pudo obtener dirección, usando coordenadas:', error);
            resolve({
              latitude: lat,
              longitude: lng,
              direccion: `${lat.toFixed(6)}, ${lng.toFixed(6)}`
            });
          }
        },
        (error) => {
          console.error('Error GPS mapa de calor:', error);
          
          let mensaje = '';
          switch(error.code) {
            case error.PERMISSION_DENIED:
              mensaje = 'Permiso de GPS denegado. Habilítalo en configuración del navegador.';
              break;
            case error.POSITION_UNAVAILABLE:
              mensaje = 'GPS no disponible. Intenta en un lugar al aire libre.';
              break;
            case error.TIMEOUT:
              mensaje = 'GPS tardó mucho tiempo. Intenta en un lugar con mejor señal.';
              break;
            default:
              mensaje = 'Error GPS desconocido';
          }
          
          reject(mensaje);
        },
        opciones
      );
    });
  }

  async obtenerDireccionDesdeCoordendas(lat: number, lng: number): Promise<string> {
    try {
      console.log(`🌍 Obteniendo dirección para: ${lat}, ${lng}`);
      
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'MedTrack-MapaCalor/1.0'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data && data.display_name) {
        const address = data.address || {};
        
        let direccionFormateada = '';
        
        // Construir dirección legible
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
        
        const resultado = direccionFormateada.length > 10 ? direccionFormateada : data.display_name;
        console.log(`✅ Dirección obtenida: ${resultado}`);
        return resultado;
      }
      
      console.warn('⚠️ No se encontró dirección, usando coordenadas');
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      
    } catch (error) {
      console.error('❌ Error en geocodificación inversa:', error);
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
  }

  esGPSDisponible(): boolean {
    return 'geolocation' in navigator;
  }

  async obtenerUbicacionConReintentos(intentos: number = 3): Promise<{latitude: number, longitude: number, direccion: string}> {
    for (let i = 0; i < intentos; i++) {
      try {
        console.log(`🔄 Intento ${i + 1} de ${intentos} para obtener GPS...`);
        const ubicacion = await this.obtenerUbicacionGPS();
        console.log(`✅ GPS obtenido en intento ${i + 1}`);
        return ubicacion;
      } catch (error) {
        console.warn(`⚠️ Intento ${i + 1} falló:`, error);
        
        if (i === intentos - 1) {
          throw error;
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    throw new Error('No se pudo obtener ubicación GPS después de varios intentos');
  }
}