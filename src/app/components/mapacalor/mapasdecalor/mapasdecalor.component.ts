import {AfterViewInit, Component} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import {MapacalorService} from '../../../services/mapacalor.service';

declare let HeatmapOverlay: any; // heatmap.js + leaflet-heatmap no tiene typings

@Component({
  selector: 'app-mapasdecalor',
  imports: [],
  templateUrl: './mapasdecalor.component.html',
  styleUrl: './mapasdecalor.component.css'
})
export class MapasdecalorComponent implements AfterViewInit {

  private isBrowser: boolean;
  //private loadedScripts: Set<string> = new Set();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  async ngAfterViewInit(): Promise<void> {
    if (this.isBrowser) {
      await this.loadHeatmapScripts();
      this.loadMap();
    }
  }

  private async loadHeatmapScripts(): Promise<void> {
    // Este orden es MUY importante
    await this.loadScript('assets/libs/leaflet.js');
    await this.loadScript('assets/libs/heatmap.min.js');
    await this.loadScript('assets/libs/leaflet-heatmap.js');  // luego el plugin
  }

  private loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => reject(`Error cargando ${src}`);
      document.body.appendChild(script);
    });
  }

  private loadMap(): void {
    const L = (window as any).L; // 👈️ aquí usamos L desde window

    const baseLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');

    const cfg = {
      radius: 15,
      maxOpacity: 0.7,
      scaleRadius: false,
      useLocalExtrema: true,
      latField: 'lat',
      lngField: 'lng',
      valueField: 'count'
    };

    const heatmapLayer = new HeatmapOverlay(cfg);

    // 🔽 AQUÍ INSERTAS ESTA PARTE 👇
    const map = new L.Map('map', {
      center: [-12.0464, -77.0428], // Centrado en Lima
      zoom: 6,
      layers: [baseLayer, heatmapLayer]
    });

    const registros = [
      { lat: -12.0464, lng: -77.0428, count: 3 },
      { lat: -12.0450, lng: -77.0410, count: 1 },
      { lat: -12.0470, lng: -77.0430, count: 5 }
    ];
    heatmapLayer.setData({ data: registros });
  }

}
