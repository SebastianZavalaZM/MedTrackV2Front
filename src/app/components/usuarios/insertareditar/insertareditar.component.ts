// insertareditar.component.ts - CON MAPA PARA SELECCIÓN MANUAL
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { RouterLink, Router, ActivatedRoute, Params } from '@angular/router';
import { Usuarios } from '../../../models/Usuarios';
import { UsuariosService } from '../../../services/usuarios.service';

@Component({
  selector: 'app-insertareditar',
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
    MatRadioModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  templateUrl: './insertareditar.component.html',
  styleUrl: './insertareditar.component.css'
})
export class InsertareditarComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  usuario: Usuarios = new Usuarios();

  status: boolean = true;
  id: number = 0;
  edicion: boolean = false;
  
  // Variables para GPS
  cargandoGPS: boolean = false;
  gpsCompletado: boolean = false;
  gpsFallo: boolean = false;
  
  // Variables para mapa manual
  mostrarMapaManual: boolean = false;

  constructor(
    private uS: UsuariosService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.init();
    });

    this.form = this.formBuilder.group({
      codigo: [''],
      username: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      fecharegistro: [new Date(), Validators.required],
      ubicacion: [{value: '', disabled: true}],
      longitudUsuario: [{value: 0, disabled: true}],
      latitudUsuario: [{value: 0, disabled: true}],
      enabled: [true, Validators.required]
    });

    // GPS automático solo si no es edición
    if (!this.edicion) {
      this.obtenerUbicacionAutomatica();
    }
  }

  // obtener mediante gps automatico
  async obtenerUbicacionAutomatica(): Promise<void> {
    this.cargandoGPS = true;
    this.gpsFallo = false;
    this.mostrarMensaje('🛰️ Obteniendo tu ubicación GPS...', 'info');
    
    try {
      const ubicacion = await this.uS.obtenerUbicacionConPrecision();
      
      this.actualizarUbicacion(
        ubicacion.latitude,
        ubicacion.longitude,
        ubicacion.direccion
      );
      
      this.gpsCompletado = true;
      
      const precision = ubicacion.precision;
      let mensajePrecision = '';
      
      if (precision <= 10) {
        mensajePrecision = '🎯 Ubicación muy precisa';
      } else if (precision <= 100) {
        mensajePrecision = '📍 Ubicación precisa';
      } else {
        mensajePrecision = '📱 Ubicación aproximada';
      }
      
      this.mostrarMensaje(`✅ ${mensajePrecision} (±${precision.toFixed(0)}m)`, 'success');
      
    } catch (error) {
      console.error('Error GPS:', error);
      this.gpsFallo = true;
      this.gpsCompletado = false;
      this.mostrarMensaje('❌ GPS no disponible. Puedes seleccionar manualmente en el mapa', 'error');
      this.habilitarSeleccionManual();
    } finally {
      this.cargandoGPS = false;
    }
  }

  // seleccion manual
  habilitarSeleccionManual(): void {
    this.mostrarMapaManual = true;
    this.form.get('ubicacion')?.enable();
    this.form.get('latitudUsuario')?.enable();
    this.form.get('longitudUsuario')?.enable();
    
    this.form.patchValue({
      ubicacion: 'Haz clic en el mapa para seleccionar tu ubicación',
      latitudUsuario: -12.0464, // lima
      longitudUsuario: -77.0428
    });
  }

  // ACTUALIZAR UBICACIÓN (GPS O MANUAL)
  actualizarUbicacion(lat: number, lng: number, direccion: string): void {
    this.form.get('ubicacion')?.enable();
    this.form.get('latitudUsuario')?.enable();
    this.form.get('longitudUsuario')?.enable();
    
    this.form.patchValue({
      ubicacion: direccion,
      latitudUsuario: lat,
      longitudUsuario: lng
    });
    
    this.form.get('ubicacion')?.disable();
    this.form.get('latitudUsuario')?.disable();
    this.form.get('longitudUsuario')?.disable();
  }

  // abrir mapa para seleccionar
  abrirMapaSeleccion(): void {
    const lat = this.form.get('latitudUsuario')?.value || -12.0464;
    const lng = this.form.get('longitudUsuario')?.value || -77.0428;
    
    // Abrir en nueva ventana con mapa interactivo
    const mapaUrl = this.generarUrlMapaInteractivo(lat, lng);
    const ventanaMapa = window.open(mapaUrl, 'seleccionarUbicacion', 'width=800,height=600');
    
    // Mostrar instrucciones
    this.mostrarMensaje('🗺️ Haz clic en el mapa para seleccionar tu ubicación', 'info');
    
    // Escuchar mensajes del mapa
    window.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'ubicacionSeleccionada') {
        this.procesarUbicacionSeleccionada(event.data.lat, event.data.lng);
        if (ventanaMapa) {
          ventanaMapa.close();
        }
      }
    });
  }

  // 🆕 GENERAR URL DE MAPA INTERACTIVO en nueva ventana
  generarUrlMapaInteractivo(lat: number, lng: number): string {
    // Crear una página HTML con mapa de OpenStreetMap
    const htmlMapa = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Seleccionar Ubicación</title>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <style>
        body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
        #map { height: 100vh; width: 100%; }
        .info-panel {
          position: absolute;
          top: 10px;
          left: 10px;
          background: white;
          padding: 15px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.3);
          z-index: 1000;
          max-width: 300px;
        }
        .coords {
          font-family: monospace;
          font-weight: bold;
          color: #333;
          margin-top: 10px;
        }
        .btn {
          background: #4CAF50;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          margin-top: 10px;
        }
        .btn:hover { background: #45a049; }
      </style>
    </head>
    <body>
      <div class="info-panel">
        <h3>📍 Seleccionar Ubicación</h3>
        <p>Haz clic en el mapa para elegir tu ubicación</p>
        <div class="coords" id="coords">Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}</div>
        <button class="btn" onclick="confirmarUbicacion()">✅ Confirmar Ubicación</button>
        <button class="btn" onclick="window.close()" style="background:#f44336;">❌ Cancelar</button>
      </div>
      <div id="map"></div>
      
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <script>
        let selectedLat = ${lat};
        let selectedLng = ${lng};
        let marker;
        
        const map = L.map('map').setView([selectedLat, selectedLng], 15);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        
        marker = L.marker([selectedLat, selectedLng], {draggable: true}).addTo(map);
        
        marker.on('dragend', function(e) {
          const pos = e.target.getLatLng();
          selectedLat = pos.lat;
          selectedLng = pos.lng;
          updateCoords();
        });
        
        map.on('click', function(e) {
          selectedLat = e.latlng.lat;
          selectedLng = e.latlng.lng;
          marker.setLatLng([selectedLat, selectedLng]);
          updateCoords();
        });
        
        function updateCoords() {
          document.getElementById('coords').textContent = 
            'Lat: ' + selectedLat.toFixed(6) + ', Lng: ' + selectedLng.toFixed(6);
        }
        
        function confirmarUbicacion() {
          window.opener.postMessage({
            type: 'ubicacionSeleccionada',
            lat: selectedLat,
            lng: selectedLng
          }, '*');
          window.close();
        }
      </script>
    </body>
    </html>`;
    
    const blob = new Blob([htmlMapa], { type: 'text/html' });
    return URL.createObjectURL(blob);
  }

  // 🆕 PROCESAR UBICACIÓN SELECCIONADA
  async procesarUbicacionSeleccionada(lat: number, lng: number): Promise<void> {
    this.mostrarMensaje('🔄 Obteniendo dirección de la ubicación seleccionada..', 'info');
    
    try {
      // Obtener dirección de las coordenadas seleccionadas
      const direccion = await this.uS.obtenerDireccionDesdeCoordendas(lat, lng);
      
      this.actualizarUbicacion(lat, lng, direccion);
      this.gpsCompletado = true;
      this.mostrarMapaManual = false;
      
      this.mostrarMensaje('✅ Ubicacion seleccionada correctamente', 'success');
      
    } catch (error) {
      console.error('Error obteniendo dirección:', error);
      this.actualizarUbicacion(lat, lng, `${lat.toFixed(6)}, ${lng.toFixed(6)}`);
      this.mostrarMensaje('✅ Ubicacion seleccionada (sin direccion)', 'success');
    }
  }

  // REINTENTAR GPS
  async reintentarGPS(): Promise<void> {
    this.mostrarMapaManual = false;
    this.gpsFallo = false;
    await this.obtenerUbicacionAutomatica();
  }

  // MOSTRAR MENSAJES
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

  aceptar(): void {
    if (this.form.valid) {
      const formValue = this.form.getRawValue();
      
      this.usuario.idUsers = formValue.codigo;
      this.usuario.username = formValue.username;
      this.usuario.correo = formValue.correo;
      this.usuario.password = formValue.password;
      this.usuario.fecharegistro = formValue.fecharegistro;
      this.usuario.ubicacion = formValue.ubicacion;
      this.usuario.longitudUsuario = formValue.longitudUsuario;
      this.usuario.latitudUsuario = formValue.latitudUsuario;
      this.usuario.enabled = formValue.enabled;

      if (this.edicion) {
        this.uS.update(this.usuario).subscribe(() => {
          this.uS.list().subscribe(data => {
            this.uS.setList(data);
          });
          this.mostrarMensaje('Usuario actualizado correctamente', 'success');
          this.router.navigate(['usuarios']);
        });
      } else {
        this.uS.insert(this.usuario).subscribe(() => {
          this.uS.list().subscribe(data => {
            this.uS.setList(data);
          });
          this.mostrarMensaje('Usuario registrado correctamente', 'success');
          this.router.navigate(['usuarios']);
        });
      }
    } else {
      this.mostrarMensaje('Por favor completa todos los campos obligatorios', 'error');
    }
  }
  
  init(): void {
    if (this.edicion) {
      this.uS.listId(this.id).subscribe(data => {
        this.form = new FormGroup({
          codigo: new FormControl(data.idUsers),
          username: new FormControl(data.username),
          correo: new FormControl(data.correo),
          password: new FormControl(data.password),
          fecharegistro: new FormControl(data.fecharegistro),
          ubicacion: new FormControl({value: data.ubicacion, disabled: true}),
          longitudUsuario: new FormControl({value: data.longitudUsuario, disabled: true}),
          latitudUsuario: new FormControl({value: data.latitudUsuario, disabled: true}),
          enabled: new FormControl(data.enabled)
        });
        this.gpsCompletado = true;
      });
    }
  }
}