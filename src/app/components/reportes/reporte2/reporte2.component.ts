import {Component, OnInit} from '@angular/core';
import {BaseChartDirective} from 'ng2-charts';
import {ChartDataset, ChartOptions, ChartType} from 'chart.js';
import {UsuariosService} from '../../../services/usuarios.service';
import {NgIf} from '@angular/common';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-reporte2',
  imports: [BaseChartDirective, MatIcon, NgIf],
  templateUrl: './reporte2.component.html',
  styleUrl: './reporte2.component.css'
})
export class Reporte2Component implements OnInit {
  hasData = false;
  barChartOptions:ChartOptions={
    responsive:true
  }
  barChartLabels:string[]=[]
  barChartType:ChartType='doughnut'
  barChartLegend=true
  barChartData:ChartDataset[]=[]

  constructor(private uS:UsuariosService){}

  ngOnInit(): void {
    this.uS.getestadisticas().subscribe(data=>{
      if (data.length > 0) {
        this.hasData = true;

        this.barChartLabels=data.map(item=>item.name);
        this.barChartData=[
          {
            data:data.map(item=>item.cantidad_registros),
            label:'Cantidad de registros',
            backgroundColor:[
              '#03045E', // Rojo intenso
              '#023E8A', // Rojo estándar
              '#0077B6', // Rojo oscuro
              '#0096C7', // Rojo claro
              '#00B4D8', // Rojo suave
              '#48CAE4', // Rojo medio
              '#90E0EF', // Rojo muy oscuro
              '#ADE8F4', // Rojo fuego
            ],
            borderColor: ['#03045E', '#0096C7', '#CAF0F8'],
            borderWidth: 1,
          }

        ];
        this.barChartOptions = {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                color: '#2e7d32',
                font: {
                  family: 'Roboto',
                  size: 14
                }
              }
            },
            title: {
              display: false
            }
          }
        };
      }else{
        this.hasData = false;

      }

    })
  }
}
