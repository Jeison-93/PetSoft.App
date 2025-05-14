import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageServices {

    // Método para recuperar una valor del localStorage
    getSessionData(key:string): any {
        const data = localStorage.getItem(key);
        return data; // Devuelve true si existe un token
      }
    
      // Método para guardar una clave en el localStorage
      setSessionData(key:string, sessionData: string): void {
        localStorage.setItem(key, sessionData);
      }
    
      setLocalData(key:string, sessionData: any): void {
        localStorage.setItem(key, sessionData);
      }
}