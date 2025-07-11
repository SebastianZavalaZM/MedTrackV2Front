import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { EnfermedadService } from '../../../services/enfermedad.service';

@Component({
  selector: 'app-reporte3',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './reporte3.component.html',
  styleUrls: ['./reporte3.component.css']
})
export class Reporte3Component implements OnInit {
  hasData = false;

  doughnutChartType: ChartType = 'doughnut';
  doughnutChartLegend = true;
  doughnutChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false
  };

  doughnutChartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: []
  };

  constructor(private enfermedadService: EnfermedadService) {}

  ngOnInit(): void {
    this.enfermedadService.contarPorNivelRiesgo().subscribe(data => {
      if (data.length > 0) {
        this.hasData = true;

        const labels = data.map(item => item[0]);
        const values = data.map(item => item[1]);

        this.doughnutChartData = {
          labels: labels,
          datasets: [
            {
              data: values,
              backgroundColor: [
                '#03045E',
                '#0077B6',
                '#00B4D8',
                '#90E0EF',
                '#CAF0F8'
              ]
            }
          ]
        };
      } else {
        this.hasData = false;
      }
    });
  }
}
