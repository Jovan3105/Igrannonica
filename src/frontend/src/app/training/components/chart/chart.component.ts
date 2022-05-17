import { Component, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Chart, ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {

  chartDisplay:string = "none";

  @Input() epoch!:number[];
  @Input() loss!:number[];
  @Input() val_loss!:number[];
  @Input() mean_absolute_error!:number[];
  @Input() val_mean_absolute_error!:number[];
  @Input() prikaz!:string;

  constructor() {}

  ngOnInit(): void {
  }

  ngOnChanges()
  {
    // TODO modifikovati da prima samo element i onda dodati u niz ovde
    this.lineChartDataLoss.datasets[0].data=this.loss;
    this.lineChartDataLoss.datasets[1].data=this.val_loss;
    this.lineChartDataLoss.labels=this.epoch;
    this.lineChartDataMeanAbsoluteError.datasets[0].data=this.mean_absolute_error;
    this.lineChartDataMeanAbsoluteError.datasets[1].data=this.val_mean_absolute_error;
    this.lineChartDataMeanAbsoluteError.labels=this.epoch;
    this.charts?.forEach((child) => {
      child.chart?.update();
  });
    this.chartDisplay=this.prikaz;
  }

  public lineChartDataLoss: ChartConfiguration['data'] = {
    datasets: [
      {
        // data: this.epoches_data.map(a => a.loss),
        data: [],
        label: 'Loss',
        backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: 'rgba(148,159,177,1)',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)',
        fill: 'origin',
      },
      {
        data: [],
        label: 'Validation Loss',
        yAxisID: 'y-axis-1',
        backgroundColor: 'rgba(255,0,0,0.3)',
        borderColor: 'red',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)',
        fill: 'origin',
      }
      // {
      //   data: [],
      //   label: 'Validation loss',
      //   backgroundColor: 'rgba(77,83,96,0.2)',
      //   borderColor: 'rgba(77,83,96,1)',
      //   pointBackgroundColor: 'rgba(77,83,96,1)',
      //   pointBorderColor: '#fff',
      //   pointHoverBackgroundColor: '#fff',
      //   pointHoverBorderColor: 'rgba(77,83,96,1)',
      //   fill: 'origin',
      // }
    ],
    labels: []
  };

  public lineChartDataMeanAbsoluteError: ChartConfiguration['data'] = {
    datasets: [
      {
        // data: this.epoches_data.map(a => a.loss),
        data: [],
        label: 'Mean Absolute Error',
        backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: 'rgba(148,159,177,1)',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)',
        fill: 'origin',
      },
      {
        data: [],
        label: 'Validation Mean Absolute Error',
        yAxisID: 'y-axis-1',
        backgroundColor: 'rgba(255,0,0,0.3)',
        borderColor: 'red',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)',
        fill: 'origin',
      }
      // {
      //   data: [],
      //   label: 'Validation loss',
      //   backgroundColor: 'rgba(77,83,96,0.2)',
      //   borderColor: 'rgba(77,83,96,1)',
      //   pointBackgroundColor: 'rgba(77,83,96,1)',
      //   pointBorderColor: '#fff',
      //   pointHoverBackgroundColor: '#fff',
      //   pointHoverBorderColor: 'rgba(77,83,96,1)',
      //   fill: 'origin',
      // }
    ],
    labels: []
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    elements: {
      line: {
        tension: 0.5
      }
    },
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      x: {},
      'y-axis-0':
        {
          position: 'left',
        },
      'y-axis-1': {
        position: 'right',
        grid: {
          color: 'rgba(255,0,0,0.3)',
        },
        ticks: {
          color: 'red'
        }
      }
    },

    plugins: {
      legend: { display: true },
    }
  };

  public lineChartType: ChartType = 'line'; 
  

  @ViewChildren(BaseChartDirective) charts?: QueryList<BaseChartDirective>;

}
