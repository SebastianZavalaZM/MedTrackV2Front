import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { Mapacalor } from '../../../models/mapacalor';
import { MapacalorService } from '../../../services/mapacalor.service';
import { Usuarios } from '../../../models/Usuarios';
import { UsuariosService } from '../../../services/usuarios.service';

// leaft
declare var L: any;

@Component({
  selector: 'app-insertareditarmc',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    CommonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatButtonModule,
    RouterLink,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    FormsModule
  ],
  templateUrl: './insertareditarmc.component.html',
  styleUrl: './insertareditarmc.component.css'
})
export class InsertareditarmcComponent implements OnInit, AfterViewInit, OnDestroy {
  form: FormGroup = new FormGroup({});
  mapacalor: Mapacalor = new Mapacalor();

  id: number = 0;
  edicion: boolean = false;
  listausers: Usuarios[] = [];

  private map: any;
  private marker: any;
  private circle: any;
  private capaBase: any;
  mapaCargado: boolean = false;
  
  radioInfluencia: number = 500; // metros
  intensidadCalor: number = 60;  // porcentaje
  ubicacionSeleccionada: boolean = false;
  tipoMapa: string = 'normal';

  niveles: {value: string; viewValue: string}[] = [
    {value: 'Alto', viewValue: 'Alto'},
    {value: 'Medio', viewValue: 'Medio'},
    {value: 'Bajo', viewValue: 'Bajo'}
  ];

  tiposMapa: {value: string; viewValue: string}[] = [
    {value: 'normal', viewValue: 'Normal'},
    {value: 'satelite', viewValue: 'Satélite'},
    {value: 'hibrido', viewValue: 'Híbrido'},
    {value: 'terreno', viewValue: 'Terreno'}
  ];

  constructor(
    private mS: MapacalorService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private uS: UsuariosService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.init();
    });

    this.form = this.formBuilder.group({
      codigomc: [''],
      latitudmc: [{value: 0, disabled: true}, Validators.required],
      longitudmc: [{value: 0, disabled: true}, Validators.required],
      nivelriesgomc: ['', Validators.required],
      fechaactualizacionmc: [new Date(), Validators.required],
      concentraciondecalormc: ['', Validators.required],
      users: ['', Validators.required]
    });

    this.uS.list().subscribe(data => {
      this.listausers = data;
    });
  }

  ngAfterViewInit(): void {
    this.cargarLeaflet();
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  cargarLeaflet(): void {
    if (typeof L === 'undefined') {
      const linkCSS = document.createElement('link');
      linkCSS.rel = 'stylesheet';
      linkCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(linkCSS);

      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => {
        console.log('✅ Leaflet cargado');
        setTimeout(() => this.inicializarMapa(), 100);
      };
      document.head.appendChild(script);
    } else {
      setTimeout(() => this.inicializarMapa(), 100);
    }
  }

  inicializarMapa(): void {
    const mapElement = document.getElementById('mapaCalor');
    if (!mapElement) {
      console.error('❌ Elemento #mapaCalor no encontrado');
      return;
    }

    try {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      this.map = L.map('mapaCalor').setView([-12.0464, -77.0428], 13);

      this.agregarCapaGoogleMaps('normal');

      const iconoCalor = L.divIcon({
        html: '<div style="background: #ff5722; border-radius: 50%; width: 20px; height: 20px; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>',
        className: 'custom-div-icon',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      this.marker = L.marker([-12.0464, -77.0428], {
        draggable: true,
        icon: iconoCalor
      }).addTo(this.map);

      this.circle = L.circle([-12.0464, -77.0428], {
        color: this.obtenerColorCalor(),
        fillColor: this.obtenerColorCalor(),
        fillOpacity: 0.4,
        radius: this.radioInfluencia,
        weight: 3
      }).addTo(this.map);

      this.configurarEventosMapa();

      this.mapaCargado = true;
      this.mostrarMensaje('🗺️ Mapa Google cargado. Haz clic para seleccionar zona', 'info');

      if (this.edicion) {
        this.cargarUbicacionExistente();
      } else {
        this.obtenerUbicacionGPS();
      }

    } catch (error) {
      console.error('❌ Error inicializando mapa:', error);
      this.mostrarMensaje('Error cargando mapa. Usarás coordenadas manuales.', 'error');
    }
  }

  agregarCapaGoogleMaps(tipo: string): void {
    let urlTile = '';
    let attribution = '';
    
    switch (tipo) {
      case 'normal':
        urlTile = 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';
        attribution = '© Google Maps';
        break;
      case 'satelite':
        urlTile = 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}';
        attribution = '© Google Satellite';
        break;
      case 'hibrido':
        urlTile = 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}';
        attribution = '© Google Hybrid';
        break;
      case 'terreno':
        urlTile = 'https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}';
        attribution = '© Google Terrain';
        break;
    }
    
    this.capaBase = L.tileLayer(urlTile, {
      attribution: attribution,
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    }).addTo(this.map);
  }

  cambiarTipoMapa(event: any): void {
    if (event && event.value) {
      this.tipoMapa = event.value;
      
      // Remover capa anterior
      if (this.capaBase) {
        this.map.removeLayer(this.capaBase);
      }
      
      // Agregar nueva capa
      this.agregarCapaGoogleMaps(this.tipoMapa);
      
      console.log(`🗺️ Tipo de mapa cambiado a: ${this.tipoMapa}`);
      this.mostrarMensaje(`🗺️ Mapa cambiado a ${this.tipoMapa}`, 'info');
    }
  }

  configurarEventosMapa(): void {
    this.marker.on('dragend', (e: any) => {
      const position = e.target.getLatLng();
      this.actualizarPosicion(position.lat, position.lng);
    });

    this.map.on('click', (e: any) => {
      this.actualizarPosicion(e.latlng.lat, e.latlng.lng);
    });

    // Añadir popup al marcador
    this.marker.bindPopup(`
      <div style="text-align: center;">
        <h4>🌡️ Zona de Calor</h4>
        <p><strong>Radio:</strong> ${this.radioInfluencia}m</p>
        <p><strong>Intensidad:</strong> ${this.intensidadCalor}%</p>
        <p><em>Arrastra para reposicionar</em></p>
      </div>
    `);
  }

  actualizarPosicion(lat: number, lng: number): void {
    this.marker.setLatLng([lat, lng]);
    
    this.circle.setLatLng([lat, lng]);
    
    this.marker.getPopup().setContent(`
      <div style="text-align: center;">
        <h4>🌡️ Zona de Calor</h4>
        <p><strong>Coordenadas:</strong><br>${lat.toFixed(6)}, ${lng.toFixed(6)}</p>
        <p><strong>Radio:</strong> ${this.radioInfluencia}m</p>
        <p><strong>Intensidad:</strong> ${this.intensidadCalor}%</p>
        <p style="color: ${this.obtenerColorCalor()}; font-weight: bold;">
          Nivel: ${this.obtenerNivelRiesgo()}
        </p>
      </div>
    `);
    
    // Actualizar formulario
    this.form.get('latitudmc')?.enable();
    this.form.get('longitudmc')?.enable();
    
    this.form.patchValue({
      latitudmc: lat,
      longitudmc: lng
    });
    
    this.form.get('latitudmc')?.disable();
    this.form.get('longitudmc')?.disable();
    
    this.ubicacionSeleccionada = true;
    this.actualizarDatosAutomaticos();
    
    console.log(`📍 Nueva posición: ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
  }

  cambiarRadio(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target) {
      this.radioInfluencia = Number(target.value);
      
      if (this.circle) {
        this.circle.setRadius(this.radioInfluencia);
        this.circle.setStyle({
          color: this.obtenerColorCalor(),
          fillColor: this.obtenerColorCalor()
        });
      }
      
      this.actualizarDatosAutomaticos();
      this.actualizarPopup();
      console.log(`📏 Radio cambiado: ${this.radioInfluencia}m`);
    }
  }

  cambiarIntensidad(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target) {
      this.intensidadCalor = Number(target.value);
      
      if (this.circle) {
        this.circle.setStyle({
          color: this.obtenerColorCalor(),
          fillColor: this.obtenerColorCalor(),
          fillOpacity: this.intensidadCalor / 100 * 0.6 + 0.2
        });
      }
      
      this.actualizarDatosAutomaticos();
      this.actualizarPopup();
      console.log(`🌡️ Intensidad cambiada: ${this.intensidadCalor}%`);
    }
  }

  actualizarPopup(): void {
    if (this.marker && this.marker.getPopup()) {
      const pos = this.marker.getLatLng();
      this.marker.getPopup().setContent(`
        <div style="text-align: center;">
          <h4>🌡️ Zona de Calor</h4>
          <p><strong>Coordenadas:</strong><br>${pos.lat.toFixed(6)}, ${pos.lng.toFixed(6)}</p>
          <p><strong>Radio:</strong> ${this.radioInfluencia}m</p>
          <p><strong>Intensidad:</strong> ${this.intensidadCalor}%</p>
          <p style="color: ${this.obtenerColorCalor()}; font-weight: bold;">
            Nivel: ${this.obtenerNivelRiesgo()}
          </p>
        </div>
      `);
    }
  }

  obtenerColorCalor(): string {
    if (this.radioInfluencia > 1000 || this.intensidadCalor > 75) {
      return '#f44336'; // Rojo - Alto riesgo
    } else if (this.radioInfluencia > 500 || this.intensidadCalor > 45) {
      return '#ff9800'; // Naranja - Medio riesgo
    } else {
      return '#4caf50'; // Verde - Bajo riesgo
    }
  }

  obtenerNivelRiesgo(): string {
    if (this.radioInfluencia > 1000 || this.intensidadCalor > 75) {
      return 'ALTO';
    } else if (this.radioInfluencia > 500 || this.intensidadCalor > 45) {
      return 'MEDIO';
    } else {
      return 'BAJO';
    }
  }

  actualizarDatosAutomaticos(): void {
    let nivelRiesgo = '';
    if (this.radioInfluencia > 1000 || this.intensidadCalor > 75) {
      nivelRiesgo = 'Alto';
    } else if (this.radioInfluencia > 500 || this.intensidadCalor > 45) {
      nivelRiesgo = 'Medio';
    } else {
      nivelRiesgo = 'Bajo';
    }

    this.form.patchValue({
      nivelriesgomc: nivelRiesgo,
      concentraciondecalormc: this.intensidadCalor
    });
  }

  async obtenerUbicacionGPS(): Promise<void> {
    try {
      const ubicacion = await this.mS.obtenerUbicacionGPS();
      
      if (this.map && this.marker && this.circle) {
        this.map.setView([ubicacion.latitude, ubicacion.longitude], 15);
        
        this.actualizarPosicion(ubicacion.latitude, ubicacion.longitude);
        
        this.mostrarMensaje('✅ Ubicación GPS obtenida', 'success');
      }
      
    } catch (error) {
      console.log('GPS no disponible:', error);
      this.mostrarMensaje('GPS no disponible. Selecciona manualmente en el mapa.', 'info');
    }
  }

  cargarUbicacionExistente(): void {
    const lat = this.form.get('latitudmc')?.value;
    const lng = this.form.get('longitudmc')?.value;
    
    if (lat && lng && this.map) {
      this.map.setView([lat, lng], 15);
      this.actualizarPosicion(lat, lng);
      this.ubicacionSeleccionada = true;
    }
  }

  centrarEnMiUbicacion(): void {
    this.obtenerUbicacionGPS();
  }

  // 💾 MOSTRAR MENSAJES
  mostrarMensaje(mensaje: string, tipo: 'success' | 'error' | 'info'): void {
    const config = {
      duration: tipo === 'info' ? 3000 : 5000,
      panelClass: [
        tipo === 'success' ? 'snack-success' : 
        tipo === 'error' ? 'snack-error' : 'snack-info'
      ]
    };
    
    this.snackBar.open(mensaje, 'Cerrar', config);
  }

  aceptar() {
    if (this.form.valid) {
      const formValue = this.form.getRawValue();
      
      this.mapacalor.idmapacalor = formValue.codigomc;
      this.mapacalor.latitud = formValue.latitudmc;
      this.mapacalor.longitud = formValue.longitudmc;
      this.mapacalor.nivelriesgo = formValue.nivelriesgomc;
      this.mapacalor.fechaactualizacion = formValue.fechaactualizacionmc;
      this.mapacalor.concentraciondecalor = formValue.concentraciondecalormc;
      this.mapacalor.users = { idUsers: formValue.users } as Usuarios;

      if (this.edicion) {
        this.mS.update(this.mapacalor).subscribe(data => {
          this.mS.list().subscribe(data => {
            this.mS.setList(data);
          });
          this.mostrarMensaje('Mapa de calor actualizado correctamente', 'success');
          this.router.navigate(['mapacalor']);
        });
      } else {
        this.mS.insert(this.mapacalor).subscribe(data => {
          this.mS.list().subscribe(data => {
            this.mS.setList(data);
          });
          this.mostrarMensaje('Mapa de calor registrado correctamente', 'success');
          this.router.navigate(['mapacalor']);
        });
      }
    } else {
      this.mostrarMensaje('Por favor completa todos los campos obligatorios', 'error');
    }
  }

  init() {
    if (this.edicion) {
      this.mS.listId(this.id).subscribe(data => {
        this.form = new FormGroup({
          codigomc: new FormControl(data.idmapacalor),
          latitudmc: new FormControl({value: data.latitud, disabled: true}),
          longitudmc: new FormControl({value: data.longitud, disabled: true}),
          nivelriesgomc: new FormControl(data.nivelriesgo),
          fechaactualizacionmc: new FormControl(data.fechaactualizacion),
          concentraciondecalormc: new FormControl(data.concentraciondecalor),
          users: new FormControl(data.users?.idUsers)
        });
        
        if (data.concentraciondecalor) {
          this.intensidadCalor = data.concentraciondecalor;
        }
        
        this.ubicacionSeleccionada = true;
      });
    }
  }
}