import { Component } from '@angular/core';
import { Reporte1Component } from './reporte1/reporte1.component';
import { ActivatedRoute, RouterOutlet} from '@angular/router';
import {Reporte2Component} from './reporte2/reporte2.component';

@Component({
  selector: 'app-reportes',
  imports: [RouterOutlet,Reporte1Component],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.css'
})
export class ReportesComponent {
  constructor(public route:ActivatedRoute) {}
}
