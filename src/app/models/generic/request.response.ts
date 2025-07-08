export class RequestResponse<T> {

    isSuccessful: boolean;
    isError: boolean;
    errorMessage: string;
    messages: string[];
    result!: T;
  
    constructor() {
      this.isSuccessful = false;
      this.isError = false;
      this.errorMessage = '';
      this.messages = [];
    }
  }