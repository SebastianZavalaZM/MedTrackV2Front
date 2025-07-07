import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { ListarrcComponent } from './listarrc/listarrc.component';

@Component({
  selector: 'app-reporteciudadano',
  imports: [RouterOutlet,ListarrcComponent],
  templateUrl: './reporteciudadano.component.html',
  styleUrl: './reporteciudadano.component.css'
})
export class ReporteciudadanoComponent {
  constructor(public route:ActivatedRoute){}
}
