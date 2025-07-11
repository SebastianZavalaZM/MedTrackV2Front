import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MapacalorService } from '../../../services/mapacalor.service';

declare var L: any;

@Component({
  selector: 'app-mapasdecalor',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './mapasdecalor.component.html',
  styleUrl: './mapasdecalor.component.css'
})
export class MapasdecalorComponent implements OnInit, AfterViewInit {

  private map: any;
  private heatLayer: any;
  mapasCalor: any[] = [];

  constructor(private mapacalorService: MapacalorService) {}

  ngOnInit(): void {
    this.cargarDatosMapaCalor();
  }

  ngAfterViewInit(): void {
    this.cargarLeaflet();
  }

  // CARGAR LEAFLET
  cargarLeaflet(): void {
    if (typeof L === 'undefined') {
      const linkCSS = document.createElement('link');
      linkCSS.rel = 'stylesheet';
      linkCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(linkCSS);

      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => {
        console.log('Leaflet cargado');
        setTimeout(() => this.inicializarMapa(), 100);
      };
      document.head.appendChild(script);
    } else {
      setTimeout(() => this.inicializarMapa(), 100);
    }
  }

  cargarDatosMapaCalor(): void {
    this.mapacalorService.list().subscribe({
      next: (data) => {
        this.mapasCalor = data;
        console.log('Datos de mapa de calor cargados:', data);

        if (this.map) {
          this.crearCapaCalor();
        }
      },
      error: (error) => {
        console.error('Error cargando datos:', error);
      }
    });
  }

  inicializarMapa(): void {
    const mapElement = document.getElementById('mapaCalor');
    if (!mapElement) {
      console.error('Elemento #mapaCalor no encontrado');
      return;
    }

    try {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      this.map = L.map('mapaCalor').setView([-12.0464, -77.0428], 10);

      L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        attribution: '© Google Maps',
        maxZoom: 20
      }).addTo(this.map);

      if (this.mapasCalor.length > 0) {
        this.crearCapaCalor();
      }
    } catch (error) {
      console.error('Error inicializando mapa:', error);
    }
  }

  crearCapaCalor(): void {
    const puntosCalor = this.mapasCalor.map(punto => [
      punto.latitud,
      punto.longitud,
      this.convertirNivelAIntensidad(punto.nivelriesgo, punto.concentraciondecalor)
    ]);

    console.log('Puntos de calor:', puntosCalor);

    if (this.heatLayer) {
      this.map.removeLayer(this.heatLayer);
    }

    this.crearCirculosCalor();
  }

  crearCirculosCalor(): void {
    this.mapasCalor.forEach(punto => {
      const color = this.obtenerColorPorNivel(punto.nivelriesgo);
      const radio = this.obtenerRadioPorConcentracion(punto.concentraciondecalor);

      const circulo = L.circle([punto.latitud, punto.longitud], {
        color: color,
        fillColor: color,
        fillOpacity: 0.4,
        radius: radio,
        weight: 3
      }).addTo(this.map);

      circulo.bindPopup(`
        <div style="text-align: center; min-width: 200px;">
          <h4>Zona de Calor</h4>
          <p><strong>Nivel:</strong> ${punto.nivelriesgo}</p>
          <p><strong>Concentración:</strong> ${punto.concentraciondecalor}%</p>
          <p><strong>Radio:</strong> ${radio}m</p>
          <p><strong>Fecha:</strong> ${new Date(punto.fechaactualizacion).toLocaleDateString()}</p>
          <p><strong>Usuario:</strong> ${punto.users?.username || 'N/A'}</p>
          <p><strong>Coordenadas:</strong><br>${punto.latitud.toFixed(6)}, ${punto.longitud.toFixed(6)}</p>
        </div>
      `);
    });
  }

  obtenerColorPorNivel(nivel: string): string {
    switch (nivel?.toLowerCase()) {
      case 'alto': return '#f44336';
      case 'medio': return '#ff9800';
      case 'bajo': return '#4caf50';
      default: return '#757575';
    }
  }

  obtenerRadioPorConcentracion(concentracion: number): number {
    return Math.max(100, Math.min(1000, concentracion * 10));
  }

  convertirNivelAIntensidad(nivel: string, concentracion: number): number {
    let multiplicador = 1;

    switch (nivel?.toLowerCase()) {
      case 'alto': multiplicador = 3; break;
      case 'medio': multiplicador = 2; break;
      case 'bajo': multiplicador = 1; break;
      default: multiplicador = 1;
    }

    return (concentracion * multiplicador) / 100;
  }

  recargarMapa(): void {
    this.cargarDatosMapaCalor();
  }
}
