import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GenericListService } from '../../services/generic.services/genericList.services';
import { ClientServices } from '../../services/client.services/client.services';
import { EncryptionService } from '../../services/encryption.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PetServices } from '../../services/pet.services/pet.services';
import { ClientAppoitmentServices } from '../../services/client.appointment.services/client.appointment.services';
import { MatSelectChange } from '@angular/material/select';
import { ConvertDateFormat } from '../../utils/generic.funcions';
import { STATE_SERVICE_AGD } from '../../models/generic/conts';


@Component({
  selector: 'app-services.create',
  standalone: false,
  templateUrl: './services.create.component.html',
  styleUrl: './services.create.component.scss'
})
export class ServicesCreateComponent {
  form: FormGroup;
  responseMessage: string | null = null;

  clients: any = [];
  pets: any = [];
  servicesType: any = [];
  servicesState: any = [];

   constructor(private fb: FormBuilder, private genericListServices: GenericListService, private petsServices: PetServices,
    private clientAppointmentServices: ClientAppoitmentServices, 
      private clientServices: ClientServices, private encryptionService: EncryptionService, private snackBar: MatSnackBar,
      private dialogRef: MatDialogRef<ServicesCreateComponent>,
    @Inject(MAT_DIALOG_DATA) 
    public data: { title: string, data : any, isEdit: boolean, user: any}){
      this.form = this.fb.group({
        id: [''],
        userSave: [''],
        userUpdate: [''],
        client: [''],
        idpet: ['', Validators.required],
        serviceState: ['', Validators.required],
        serviceType: ['',Validators.required],
        dateService: ['',Validators.required],
        hourService: ['',Validators.required],
        value: ['', [Validators.required, Validators.min(1)]]
      });
  
      if(data.isEdit)
      {
        this.form.patchValue({
          id: this.data.data.id,
          client: this.data.data.idClient,
          idpet: this.data.data.idPet ,
          serviceState: this.data.data.state,
          serviceType: this.data.data.serviceType,
          dateService: this.data.data.dateService,
          hourService: this.data.data.hourService,
          value: this.data.data.value,
          userUpdate: this.data.user
        });
      }else{
        this.form.patchValue({
          serviceState: STATE_SERVICE_AGD,
          userSave: this.data.user
        });
      }
    }
    ngOnInit(): void {
      this.getGenericList();
    }
  
    private getGenericList(){
      this.clientServices.GetActiveClients().subscribe((res)=>{
        if(res.isSuccessful)
          {
            this.clients = Object.assign([], [...res.result]);
          }
          else {
            this.responseMessage = res.isError ? res.errorMessage : res.message;
            this.showSnackbar();
          }
        });

      this.genericListServices.GetGenericTable('ServiceType').subscribe((res)=>{
        if(res.isSuccessful)
        {
          this.servicesType = Object.assign([], [...res.result]);
        }
        else {
          this.responseMessage = res.isError ? res.errorMessage : res.message;
          this.showSnackbar();
        }
      });
  
      this.genericListServices.GetGenericTable('ServiceState').subscribe((res)=>{
        if(res.isSuccessful)
        {
          this.servicesState = Object.assign([], [...res.result]);
        }
        else {
          this.responseMessage = res.isError ? res.errorMessage : res.message;
          this.showSnackbar();
        }
      });
      
    }


    onClientChange(event: MatSelectChange): void {
      const value = event.value;
      this.pets =   Object.assign([], []);
      this.petsServices.GetAllPets(value).subscribe((res => {
        if(res.isSuccessful){
          this.pets =   Object.assign([], [...res.result]);
        }
        else{
          this.pets =   Object.assign([], []);
        }
  
      })); 
    }

    save(){
      if (this.form.valid) {
        this.form.patchValue({
          dateService: ConvertDateFormat(this.form.value.dateService)
        });
        if(this.data.isEdit){
          this.OnUpdate();
        }
        else{
          this.OnSave();
        }
      } else {
        this.responseMessage = 'Debe completar todos los campos requeridos';
        this.showSnackbar();
      }
    }

    close(){
      this.dialogRef.close();
    }

    
    OnSave(){
      this.clientAppointmentServices.Save(this.form.value).subscribe(res => {
        if(res.isError || !res.isSuccessful){
          this.responseMessage =  res.errorMessage != null ? res.errorMessage : res.message;
          this.showSnackbar();
        }else{
          this.responseMessage = res.result;
          this.showSnackbar();
            setTimeout(() => {
              this.close();
            }, 3000);
          }
      });
    }
    
    OnUpdate(){
      if (this.form.valid) {
        this.clientAppointmentServices.Update(this.form.value).subscribe(res => {
          if(res.isError || !res.isSuccessful){
            this.responseMessage =  res.errorMessage != null ? res.errorMessage : res.message;
            this.showSnackbar();
          }else{
            this.responseMessage = res.result;
            this.showSnackbar();
              setTimeout(() => {
                this.close();
              }, 3000);
            }
        });
      } else {
        this.responseMessage = 'Debe completar todos los campos requeridos';
        this.showSnackbar();
      }
    }
    

    showSnackbar() {
      this.snackBar.open(`${this.responseMessage}`,'', {
        duration: 3000, // Duración en milisegundos
        horizontalPosition: 'center', // Opciones: 'start' | 'center' | 'end' | 'left' | 'right'
        verticalPosition: 'bottom' 
      });
    }
  
}
