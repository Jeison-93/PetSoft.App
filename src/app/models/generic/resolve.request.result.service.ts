import { Injectable } from '@angular/core';
import { RequestResponse } from './request.response';

@Injectable({
  providedIn: 'root',
})
export class ResolveRequestResultService {
  constructor() {

  }

  /**
   * Validacion Objeto RequestResult
   * @param {*} requestResult
   */
  resolve<T>(requestResult: RequestResponse<T>) {
    try {
      if (requestResult.isError) {
        
        throw new Error(requestResult.errorMessage);
      }
      if (!requestResult.isSuccessful) {
        throw new Error(requestResult.messages[0]);
      }
      return requestResult.result;
    } catch (error) {
      throw new Error(requestResult.errorMessage);
    }
  }

}
