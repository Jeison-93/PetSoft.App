import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, from, map, retry } from 'rxjs';
import { ConfigService } from '../config.service';
import { TOKEN_LS_NAME } from '../../models/generic/conts';

@Injectable({
  providedIn: 'root',
})
export class AuthServices {
  private handleError: any;

  constructor(private http: HttpClient, private configService: ConfigService) {}

  // Método para verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    const token = localStorage.getItem(TOKEN_LS_NAME);
    return !!token; // Devuelve true si existe un token
  }

  // Método para guardar el token
  setToken(token: string): void {
    localStorage.setItem(TOKEN_LS_NAME, token);
  }

  // Método para eliminar el token
  clearToken(key: string): void {
    localStorage.removeItem(key);
  }

  // Método para obtener el usuario
  RequestLogin(data: any) {
    const params: any = {
      email: data.user,
      passWord: data.password,
    };

    return this.http
      .post<any>(
        `${this.configService.configValue.urlApiAuth}RequestLogin`,
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
}
