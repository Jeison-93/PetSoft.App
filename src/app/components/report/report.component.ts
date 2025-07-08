import { Component, OnInit } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GenericListService } from '../../services/generic.services/genericList.services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReportService } from '../../services/reports/reports.services';

@Component({
  selector: 'app-report',
  standalone: false,
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss',
})
export class ReportComponent implements OnInit {
  form!: FormGroup;
  chart!: Chart;
  servicesType: any = [];
  servicesState: any = [];
  responseMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private genericListServices: GenericListService,
    private reportServices: ReportService,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      serviceType: [''],
      state: [''],
    });
  }

  ngOnInit(): void {
    this.getGenericList();
  }

  private getGenericList() {
    this.genericListServices.GetGenericTable('ServiceType').subscribe((res) => {
      if (res.isSuccessful) {
        this.servicesType = Object.assign([], [...res.result]);
      } else {
        this.responseMessage = res.isError ? res.errorMessage : res.message;
        this.showSnackbar();
      }
    });

    this.genericListServices
      .GetGenericTable('ServiceState')
      .subscribe((res) => {
        if (res.isSuccessful) {
          this.servicesState = Object.assign([], [...res.result]);
        } else {
          this.responseMessage = res.isError ? res.errorMessage : res.message;
          this.showSnackbar();
        }
      });
  }

  search() {
    if (this.form.valid) {
      this.chart = new Chart({ title: { text: 'Reporte de Servicios' } });
      this.getReportServices();
    } else {
      this.responseMessage = 'Debe completar todos los campos requeridos';
      this.showSnackbar();
    }
  }

  ResetValues() {
    this.chart = new Chart({ title: { text: 'Reporte de Servicios' } }); // Reset the chart
    this.responseMessage = null;
    this.form.reset();
  }

  getReportServices() {
    this.reportServices.GetReportServices(this.form.value).subscribe({
      next: (response) => {
        if (response.isSuccessful) {
          this.createChart(response.result);
        } else {
          console.error('Error fetching report services:', response.message);
        }
      },
      error: (error) => {
        console.error('Error fetching report services:', error);
      },
    });
  }

  createChart(data: any) {
    interface ReportServiceData {
      date: string;
      amount: number;
    }

    const categories = (data as ReportServiceData[]).map(
      (d: ReportServiceData) => d.date
    );
    const seriesData = (data as ReportServiceData[]).map(
      (d: ReportServiceData) => d.amount
    );

    this.chart = new Chart({
      chart: {
        type: 'column',
      },
      title: {
        text: 'Reporte de Servicios',
      },
      xAxis: {
        categories: categories,
        title: { text: 'Fecha' },
      },
      yAxis: {
        title: { text: 'Cantidad' },
      },
      series: [
        {
          name: 'Cantidad',
          type: 'column',
          data: seriesData,
        },
      ],
    });
  }

  showSnackbar() {
    this.snackBar.open(`${this.responseMessage}`, '', {
      duration: 3000, // Duración en milisegundos
      horizontalPosition: 'center', // Opciones: 'start' | 'center' | 'end' | 'left' | 'right'
      verticalPosition: 'bottom',
    });
  }
}
