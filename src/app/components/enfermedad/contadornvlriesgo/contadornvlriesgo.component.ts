import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { EnfermedadService } from '../../../services/enfermedad.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { NgChartsModule } from 'ng2-charts';
import { ChartType, ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-contadornvlriesgo',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    NgChartsModule
  ],
  templateUrl: './contadornvlriesgo.component.html',
  styleUrls: ['./contadornvlriesgo.component.css']
})
export class ContadornvlriesgoComponent implements OnInit {
  displayedColumns: string[] = ['nivelRiesgo', 'cantidad'];
  dataSource: MatTableDataSource<{ nivelRiesgo: string; cantidad: number }> = new MatTableDataSource();

  // Gráfico circular
  pieChartType: ChartType = 'pie';
  pieChartData: ChartData<'pie', number[], string> = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ['#e53935', '#ffb300', '#43a047']  // colores para Alto, Medio, Bajo
      }
    ]
  };
  pieChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  isBrowser = false;
  mostrarGrafico = false;

  constructor(
    private enfermedadService: EnfermedadService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);

    this.enfermedadService.contarPorNivelRiesgo().subscribe(res => {
      const data = res.map(item => ({
        nivelRiesgo: item[0],
        cantidad: item[1]
      }));
      this.dataSource = new MatTableDataSource(data);

      if (this.isBrowser) {
        this.pieChartData.labels = data.map(d => d.nivelRiesgo);
        this.pieChartData.datasets[0].data = data.map(d => d.cantidad);
      }
    });
  }
}
