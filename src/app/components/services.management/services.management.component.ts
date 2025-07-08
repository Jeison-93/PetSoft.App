import { Component, OnInit } from '@angular/core';
import { ClientAppoitmentServices } from '../../services/client.appointment.services/client.appointment.services';
import { LocalStorageServices } from '../../services/auth.services/localStorage.Services';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  SESSION_LS_NAME,
  STATE_SERVICE_ATEN,
  STATE_SERVICE_CONF,
} from '../../models/generic/conts';
import { EncryptionService } from '../../services/encryption.service';

@Component({
  selector: 'app-services.management',
  standalone: false,
  templateUrl: './services.management.component.html',
  styleUrl: './services.management.component.scss',
})
export class ServicesManagementComponent implements OnInit {
  dataSent: any;
  user: any;

  // Configuración de paginación
  itemsPerPage: number = 5;
  currentPage: number = 1;
  paginatedData: any[] = [];

  dataSource: any[] = [];

  responseMessage: string | null = null;
  searchTerm: string = '';
  filteredData: any[] = [];

  constructor(
    private clientAppointmentServices: ClientAppoitmentServices,
    private localStorageServices: LocalStorageServices,
    private snackBar: MatSnackBar,
    private encryptionService: EncryptionService
  ) {}

  ngOnInit(): void {
    const encryptedSession = localStorage.getItem(SESSION_LS_NAME);
    if (encryptedSession) {
      const storedData = this.encryptionService.decryptToken(encryptedSession);
      this.dataSent = storedData ? JSON.parse(storedData) : [];
      this.user = this.dataSent.id;
    }
    this.getData();
  }
  private getData() {
    this.clientAppointmentServices
      .GetAppointmentsByState(STATE_SERVICE_CONF)
      .subscribe((res) => {
        if (res.isSuccessful) {
          this.dataSource = Object.assign([], [...res.result]);
          this.updatePagination();
        } else {
          this.dataSource = [];
          this.responseMessage = res.isError ? res.errorMessage : res.message;
          this.showSnackbar();
        }
      });
  }

  changeState(row: any) {
    this.clientAppointmentServices
      .ChangeState(row.id, STATE_SERVICE_ATEN, this.user)
      .subscribe((res) => {
        if (res.isSuccessful) {
          this.responseMessage = 'El servicio ha sido atendido correctamente';
          this.showSnackbar();
          this.getData();
        } else {
          this.responseMessage = res.isError ? res.errorMessage : res.message;
          this.showSnackbar();
        }
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
    this.filteredData = this.paginatedData; // Inicializa con todos los datos
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages.length) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  onSearchChange() {
    const term = this.searchTerm ? this.searchTerm.toLowerCase() : '';
    this.filteredData = this.paginatedData.filter(
      (item) => item.clientName && item.clientName.toLowerCase().includes(term)
    );
  }

  showSnackbar() {
    this.snackBar.open(`${this.responseMessage}`, '', {
      duration: 3000, // Duración en milisegundos
      horizontalPosition: 'center', // Opciones: 'start' | 'center' | 'end' | 'left' | 'right'
      verticalPosition: 'bottom',
    });
  }
}
