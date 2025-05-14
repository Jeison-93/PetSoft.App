import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, from, map, retry } from 'rxjs';
import { ConfigService } from '../config.service';
import { TOKEN_LS_NAME } from '../../models/generic/conts';



@Injectable({
  providedIn: 'root'
})
export class AuthServices {
    private handleError: any;
    
    constructor(private http: HttpClient, private configService: ConfigService,) {}

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
    clearToken(key:string): void {
      localStorage.removeItem(key);
    }

    // Método para obtener el usuario
    RequestLogin(data: any){
        const params: any = {
            userName: data.user,
            passWord: data.password
          };

        return this.http.post<any>(`${this.configService.configValue.urlApiAuth}RequestLogin`,params)
        .pipe(retry(0), catchError(this.handleError), 
        map((response)=>{
            return response;
        }))
    }

    GetUserTmp(user: any){
      let users = [
        {User:'admon', Name:'Administrador', Speciality:'Administrador', Role:'300', RoleApp:''},
        {User:'rsalas', Name:'Laura Salas', Speciality:'Medicina Interna', Role:'001', RoleApp:''},
        {User:'lcastro', Name:'Luis Castro', Speciality:'Medicina Interna', Role:'300',RoleApp:''},
        {User:'avalencia', Name:'Alejandra Valencia', Speciality:'Medicina Interna', Role:'001', RoleApp:''},
        {User:'mlopez', Name:'Mónica López', Speciality:'Medicina Interna', Role:'001', RoleApp:''},
      ];

      let allow = users.filter(f => f.User === user);

      return from([allow[0]]);
    }
  }
  