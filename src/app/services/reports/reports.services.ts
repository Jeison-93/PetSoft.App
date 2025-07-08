import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, retry } from 'rxjs';
import { ConfigService } from '../config.service';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private handleError: any;

  constructor(private http: HttpClient, private configService: ConfigService) {}

  GetReportServices(params: any): Observable<any> {
    return this.http
      .post<any>(`${this.configService.configValue.urlApiReport}Get`, params)
      .pipe(
        retry(0),
        catchError(this.handleError),
        map((response) => {
          return response;
        })
      );
  }
}
