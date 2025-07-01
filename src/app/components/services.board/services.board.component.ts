import { Component, OnInit } from '@angular/core';
import { LocalStorageServices } from '../../services/auth.services/localStorage.Services';
import { GenericListService } from '../../services/generic.services/genericList.services';
import { MatDialog } from '@angular/material/dialog';
import { EncryptionService } from '../../services/encryption.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientServices } from '../../services/client.services/client.services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PetServices } from '../../services/pet.services/pet.services';
import { ClientAppoitmentServices } from '../../services/client.appointment.services/client.appointment.services';
import {
  SESSION_LS_NAME,
  STORAGE_LS_ADMON,
  STORAGE_LS_USER,
} from '../../models/generic/conts';
/*import { ServicesCreateComponent } from '../services.create/services.create.component';*/
import { MatSelectChange } from '@angular/material/select';
import { ServicesCreateComponent } from '../services.create/services.create.component';

@Component({
  selector: 'app-services.board',
  standalone: false,
  templateUrl: './services.board.component.html',
  styleUrl: './services.board.component.scss',
})
export class ServicesBoardComponent implements OnInit {
  form!: FormGroup;
  dataSent: any;
  user: any;
  // Configuración de paginación
  itemsPerPage: number = 5;
  currentPage: number = 1;
  paginatedData: any[] = [];

  dataSource: any[] = [];
  clients: any = [];
  pets: any = [];
  servicesType: any = [];
  servicesState: any = [];

  responseMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private clientAppointmentServices: ClientAppoitmentServices,
    private clientServices: ClientServices,
    private localStorageServices: LocalStorageServices,
    private genericListServices: GenericListService,
    private snackBar: MatSnackBar,
    private petsServices: PetServices,
    public dialog: MatDialog,
    private encryptionService: EncryptionService
  ) {
    this.form = this.fb.group({
      IdClient: [''],
      IdPet: [],
      IdServices: [''],
      IdState: [''],
    });
  }
  ngOnInit(): void {
    const encryptedSession = localStorage.getItem(SESSION_LS_NAME);
    if (encryptedSession) {
      const storedData = this.encryptionService.decryptToken(encryptedSession);
      this.dataSent = storedData ? JSON.parse(storedData) : [];
      this.user = this.dataSent.id;
    }
    this.getGenericList();
  }

  onClientChange(event: MatSelectChange): void {
    const value = event.value;
    this.pets = Object.assign([], []);
    this.dataSource = Object.assign([], []);
    this.updatePagination();
    this.petsServices.GetAllPets(value).subscribe((res) => {
      if (res.isSuccessful) {
        this.pets = Object.assign([], [...res.result]);
      } else {
        this.pets = Object.assign([], []);
      }
    });
  }

  private getGenericList() {
    this.clientServices.GetActiveClients().subscribe((res) => {
      if (res.isSuccessful) {
        this.clients = Object.assign([], [...res.result]);
      } else {
        this.responseMessage = res.isError ? res.errorMessage : res.message;
        this.showSnackbar();
      }
    });

    this.genericListServices.GetGenericTable('ServiceType').subscribe((res) => {
      if (res.isSuccessful) {
        this.servicesType = Object.assign([], [...res.result]);
      } else {
        this.responseMessage = res.isError ? res.errorMessage : res.message;
        this.showSnackbar();
      }
    });

    this.genericListServices
      .GetGenericTable('ServiceState')
      .subscribe((res) => {
        if (res.isSuccessful) {
          this.servicesState = Object.assign([], [...res.result]);
        } else {
          this.responseMessage = res.isError ? res.errorMessage : res.message;
          this.showSnackbar();
        }
      });
  }

  private getData() {
    if (this.form.valid) {
      this.clientAppointmentServices
        .GetAppointments(this.form.value)
        .subscribe((res) => {
          if (res.isSuccessful) {
            this.dataSource = Object.assign([], [...res.result]);
            this.updatePagination();
          } else {
            this.responseMessage = res.isError ? res.errorMessage : res.message;
            this.showSnackbar();
          }
        });
    }
  }

  search() {
    if (this.form.valid) {
      this.dataSource = [];
      this.updatePagination();
      this.getData();
    } else {
      this.responseMessage = 'Debe completar todos los campos requeridos';
      this.showSnackbar();
    }
  }

  ResetValues() {
    this.paginatedData = [];
    this.dataSource = [];
    this.form.reset();
    this.pets = Object.assign([], []);
  }

  addAppointment() {
    const dialogRef = this.dialog.open(ServicesCreateComponent, {
      width: '85%',
      data: {
        title: 'Crear Cita',
        isEdit: false,
        user: this.user,
      },
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getData();
    });
  }

  editAppointment(row: any) {
    const encryptedValue = this.encryptionService.encryptToken(
      JSON.stringify(row)
    );
    this.localStorageServices.setLocalData(STORAGE_LS_USER, encryptedValue);

    const dialogRef = this.dialog.open(ServicesCreateComponent, {
      width: '80%',
      data: {
        title: 'Editar Cita',
        data: row,
        isEdit: true,
        user: this.user,
      },
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getData();
    });
  }

  onValueChange(newValue: number): void {
    this.currentPage = 1;
    this.updatePagination();
  }
  get totalPages(): number[] {
    return Array(Math.ceil(this.dataSource.length / Number(this.itemsPerPage)))
      .fill(0)
      .map((_, i) => i + 1);
  }

  updatePagination() {
    this.paginatedData = [];
    const start = (this.currentPage - 1) * Number(this.itemsPerPage);
    const end = start + Number(this.itemsPerPage);
    this.paginatedData = this.dataSource.slice(start, end);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages.length) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  showSnackbar() {
    this.snackBar.open(`${this.responseMessage}`, '', {
      duration: 3000, // Duración en milisegundos
      horizontalPosition: 'center', // Opciones: 'start' | 'center' | 'end' | 'left' | 'right'
      verticalPosition: 'bottom',
    });
  }
}
