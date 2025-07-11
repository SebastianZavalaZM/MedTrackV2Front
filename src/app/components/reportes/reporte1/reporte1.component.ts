import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { BaseChartDirective } from 'ng2-charts';
import {ChartDataset, ChartOptions, ChartType} from 'chart.js';
import {UsuariosService} from '../../../services/usuarios.service';

@Component({
  selector: 'app-reporte1',
  imports: [
    BaseChartDirective,
    CommonModule,
    MatIconModule
  ],
  templateUrl: './reporte1.component.html',
  styleUrl: './reporte1.component.css'
})
export class Reporte1Component implements OnInit {
  hasData = false;
  barChartOptions:ChartOptions={
    responsive:true
  }

  barChartLabels:string[]=[]
  barChartType:ChartType='bar'
  barChartLegend=true
  barChartData:ChartDataset[]=[]
  constructor(private uS: UsuariosService){}

  ngOnInit():void {
    this.uS.getdistribucion().subscribe(data=>{
      if (data.length > 0){
            this.hasData = true;

            this.barChartLabels=data.map(item =>item.name_suscription)
            this.barChartData=[
              {
                data:data.map(item =>item.cantidad),
                label:'Cantidad de usuarios por suscripción',
                backgroundColor: [
                  '#03045E', // Rojo intenso
                  '#023E8A', // Rojo estándar
                  '#0077B6', // Rojo oscuro
                  '#0096C7', // Rojo claro
                  '#00B4D8', // Rojo suave
                  '#48CAE4', // Rojo medio
                  '#90E0EF', // Rojo muy oscuro
                  '#ADE8F4',
                ],
                yAxisID: 'y',
              },
              {
                data: data.map(item => item.porcentaje),
                label: 'Porcentaje (%)',
                type: 'line',
                borderColor: '#007bff',
                backgroundColor: 'rgba(0,123,255,0.2)',
                yAxisID: 'y1'
              }
            ];
            this.barChartOptions = {
              responsive: true,
              scales: {
                y: { beginAtZero: true, position: 'left', title: { display: true, text: 'Cantidad' } },
                y1: { beginAtZero: true, position: 'right', title: { display: true, text: 'Porcentaje (%)' }, grid: { drawOnChartArea: false } }
              }

            };
      } else{
        this.hasData = false;
      }
    });
  }
}
