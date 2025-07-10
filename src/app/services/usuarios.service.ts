// usuarios.service.ts - CORREGIR MÉTODO PÚBLICO
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { Usuarios } from '../models/Usuarios';

const base_url = environment.base;

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private listaCambio = new Subject<Usuarios[]>();
  private url = `${base_url}/usuarios`;

  constructor(private http: HttpClient) { }

  // MÉTODOS CRUD BÁSICOS
  list(): Observable<Usuarios[]> {
    return this.http.get<Usuarios[]>(this.url);
  }
  
  insert(u: Usuarios): Observable<any> {
    return this.http.post(this.url, u);
  }

  setList(listaNueva: Usuarios[]): void {
    this.listaCambio.next(listaNueva);
  }
  
  getList(): Observable<Usuarios[]> {
    return this.listaCambio.asObservable();
  }

  listId(id: number): Observable<Usuarios> {
    return this.http.get<Usuarios>(`${this.url}/${id}`);
  }

  update(u: Usuarios): Observable<any> {
    return this.http.put(this.url, u);
  }

  deleteA(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }

  // GPS CON PRECISIÓN
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

  // 🆕 MÉTODO PÚBLICO PARA OBTENER DIRECCIÓN
  async obtenerDireccionDesdeCoordendas(lat: number, lng: number): Promise<string> {
    try {
      // Usando la API gratuita de OpenStreetMap Nominatim
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
        const direccionCompleta = data.display_name;
        
        // Intentar extraer partes importantes de la dirección
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
        return direccionFormateada.length > 10 ? direccionFormateada : direccionCompleta;
      }
      
      // Si no hay respuesta válida, devolver coordenadas
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      
    } catch (error) {
      console.warn('Error en geocodificación inversa:', error);
      
      // Como fallback, intentar con una API alternativa
      try {
        return await this.geocodificacionAlternativa(lat, lng);
      } catch (errorAlternativo) {
        console.warn('Error en API alternativa también:', errorAlternativo);
        return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      }
    }
  }

  // 🆕 MÉTODO PÚBLICO SIMPLE PARA OBTENER GPS
  obtenerUbicacionGPS(): Promise<{latitude: number, longitude: number, direccion: string}> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject('Geolocalización no soportada por este navegador');
        return;
      }

      const opciones = {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 300000
      };

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          console.log(`📍 GPS obtenido - Lat: ${lat}, Lng: ${lng}`);
          
          try {
            const direccion = await this.obtenerDireccionDesdeCoordendas(lat, lng);
            
            resolve({
              latitude: lat,
              longitude: lng,
              direccion: direccion
            });
            
          } catch (error) {
            console.warn('No se pudo obtener la dirección, usando coordenadas:', error);
            resolve({
              latitude: lat,
              longitude: lng,
              direccion: `${lat.toFixed(6)}, ${lng.toFixed(6)}`
            });
          }
        },
        (error) => {
          console.error('Error GPS:', error);
          
          let mensaje = 'Error desconocido obteniendo ubicación';
          
          switch(error.code) {
            case error.PERMISSION_DENIED:
              mensaje = 'Permiso de ubicación denegado por el usuario';
              break;
            case error.POSITION_UNAVAILABLE:
              mensaje = 'Información de ubicación no disponible';
              break;
            case error.TIMEOUT:
              mensaje = 'Tiempo de espera agotado obteniendo ubicación';
              break;
          }
          
          reject(mensaje);
        },
        opciones
      );
    });
  }

  // MÉTODO PRIVADO PARA API ALTERNATIVA
  private async geocodificacionAlternativa(lat: number, lng: number): Promise<string> {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=es`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data && data.locality) {
      let direccion = '';
      
      if (data.locality) direccion += data.locality;
      if (data.city && data.city !== data.locality) direccion += ', ' + data.city;
      if (data.principalSubdivision) direccion += ', ' + data.principalSubdivision;
      if (data.countryName) direccion += ', ' + data.countryName;
      
      return direccion || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
    
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  }

  // VERIFICAR SI GPS ESTÁ DISPONIBLE
  esGPSDisponible(): boolean {
    return 'geolocation' in navigator;
  }
}