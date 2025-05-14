import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, from, map, retry } from 'rxjs';
import { ConfigService } from '../config.service';
import { TOKEN_LS_NAME } from '../../models/generic/conts';

@Injectable({
  providedIn: 'root',
})
export class ClientAppoitmentServices {
  private handleError: any;

  constructor(private http: HttpClient, private configService: ConfigService) {}

  // Método para verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    const token = localStorage.getItem(TOKEN_LS_NAME);
    return !!token; // Devuelve true si existe un token
  }

  GetAppointments(params: any): Observable<any> {
    return this.http
      .post<any>(
        `${this.configService.configValue.urlApiAppointments}GetAppointments`,
        params
      )
      .pipe(
        retry(0),
        catchError(this.handleError),
        map((response) => {
          return response;
        })
      );
  }

  GetById(id: number) {
    return this.http
      .get<any>(
        `${this.configService.configValue.urlApiAppointments}GetById?Id=${id}`
      )
      .pipe(
        retry(0),
        catchError(this.handleError),
        map((response) => {
          if (response.isSuccessful) return response.result;
          else return false;
        })
      );
  }

  Save(params: any): Observable<any> {
    return this.http
      .post<any>(
        `${this.configService.configValue.urlApiAppointments}Save`,
        params
      )
      .pipe(
        retry(0),
        catchError(this.handleError),
        map((response) => {
          return response;
        })
      );
  }

  Update(params: any): Observable<any> {
    debugger;
    return this.http
      .put<any>(
        `${this.configService.configValue.urlApiAppointments}Update`,
        params
      )
      .pipe(
        retry(0),
        catchError(this.handleError),
        map((response) => {
          return response;
        })
      );
  }

  ChangeState(id: any, state: string, user: any): Observable<any> {
    debugger;
    let params = {
      id: id,
      serviceState: state,
      userUpdate: user,
    };
    return this.http
      .put<any>(
        `${this.configService.configValue.urlApiAppointments}ChangeState`,
        params
      )
      .pipe(
        retry(0),
        catchError(this.handleError),
        map((response) => {
          return response;
        })
      );
  }

  GetAppointmentsByState(state: string) {
    return this.http
      .get<any>(
        `${this.configService.configValue.urlApiAppointments}GetAppointmentsByState?state=${state}`
      )
      .pipe(
        retry(0),
        catchError(this.handleError),
        map((response) => {
          return response;
        })
      );
  }
}
