import { ClientRequestDTO } from "../models/DTO/clientRequestDTO";
import { ClientRequesUpdatetDTO } from "../models/DTO/clientRequestUpdateDTO";
import { UserRequestDTO } from "../models/DTO/userRequestDTO";
import { UserRequesUpdatetDTO } from "../models/DTO/userRequestUpdateDTO";


export function MapperRequestUserDTO(model:any) : UserRequestDTO{
   
    const response: UserRequestDTO = new UserRequestDTO();
    response.documentType = model.documentType;
    response.documentNumber = model.documentNumber;
    response.name = model.name;
    response.lastName = model.lastName;
    response.email = model.email;
    response.password = model.password;
    response.phone = model.phone;
    response.addresss = model.addresss;
    response.userType = model.userType;
    return response;
  }


  export function MapperRequestUpdateUserDTO(model:any, id:any) : UserRequesUpdatetDTO{
   
    const response: UserRequesUpdatetDTO = new UserRequesUpdatetDTO();
    response.id = id;
    response.documentType = model.documentType;
    response.documentNumber = model.documentNumber;
    response.name = model.name;
    response.lastName = model.lastName;
    response.email = model.email;
    response.password = model.password;
    response.phone = model.phone;
    response.addresss = model.addresss;
    response.userType = model.userType;
    response.state = model.state;
    return response;
  }


  export function MapperRequestClientDTO(model:any) : ClientRequestDTO{
   
    const response: ClientRequestDTO = new ClientRequestDTO();
    response.documentType = model.documentType;
    response.documentNumber = model.documentNumber;
    response.name = model.name;
    response.lastName = model.lastName;
    response.email = model.email;
    response.phone = model.phone;
    response.addresss = model.addresss;
    return response;
  }


  export function MapperRequestUpdateClientDTO(model:any, id:any) : ClientRequesUpdatetDTO{
   
    const response: ClientRequesUpdatetDTO = new ClientRequesUpdatetDTO();
    response.id = id;
    response.documentType = model.documentType;
    response.documentNumber = model.documentNumber;
    response.name = model.name;
    response.lastName = model.lastName;
    response.email = model.email;
    response.phone = model.phone;
    response.addresss = model.addresss;
    response.state = model.state;
    return response;
  }