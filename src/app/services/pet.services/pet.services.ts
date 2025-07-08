import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, from, map, retry } from 'rxjs';
import { ConfigService } from '../config.service';
import { TOKEN_LS_NAME } from '../../models/generic/conts';


@Injectable({
  providedIn: 'root'
})
export class PetServices {

    private handleError: any;

    constructor(private http: HttpClient, private configService: ConfigService,) {}

      // Método para verificar si el usuario está autenticado
      isAuthenticated(): boolean {
      const token = localStorage.getItem(TOKEN_LS_NAME);
      return !!token; // Devuelve true si existe un token
    }

    // Método para obtener todos las mascotas
    GetAllPets(clientId: any){
      return this.http
      .get<any>(
        `${this.configService.configValue.urlApiPet}GetAllPets?client=${clientId}`
      )
      .pipe(
        retry(0),
        catchError(this.handleError),
        map((response) => {
          return response;
        })
      );
    }
    

    GetById(id:number){
      return this.http
      .get<any>(
        `${this.configService.configValue.urlApiPet}GetById?Id=${id}`
      )
      .pipe(
        retry(0),
        catchError(this.handleError),
        map((response) => {
          if(response.isSuccessful)
            return response.result;
            else
          return false
        })
      );
    }

    Save(params: any):Observable<any>{
      return this.http.post<any>(`${this.configService.configValue.urlApiPet}Save`,params)
      .pipe(retry(0), catchError(this.handleError), 
      map((response)=>{
        return  response;
      }))
    }

    Update(params: any):Observable<any>{
        return this.http.put<any>(`${this.configService.configValue.urlApiPet}Update`,params)
        .pipe(retry(0), catchError(this.handleError), 
        map((response)=>{
            return  response;
        }))
      }

    ChangeState(params: any):Observable<any>{
      return this.http.put<any>(`${this.configService.configValue.urlApiPet}ChangeState?Id=${params}`,params)
      .pipe(retry(0), catchError(this.handleError), 
      map((response)=>{
          return  response;
      }))
    }

  }
  