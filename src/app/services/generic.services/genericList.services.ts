import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, from, map, retry } from 'rxjs';
import { ConfigService } from '../config.service';
import { TOKEN_LS_NAME } from '../../models/generic/conts';

@Injectable({
  providedIn: 'root',
})
export class GenericListService {
  private handleError: any;

  constructor(private http: HttpClient, private configService: ConfigService) {}

  // Método para verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    const token = localStorage.getItem(TOKEN_LS_NAME);
    return !!token; // Devuelve true si existe un token
  }

  // Método para obtener una lista de una table genérica
  //DocumentType
  //UserType
  //ServiceState
  //Species
  GetGenericTable(table: string) {
    return this.http
      .get<any>(
        `${this.configService.configValue.urlApiGeneric}GetTable?table=${table}`
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
