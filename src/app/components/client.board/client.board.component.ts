import { Component } from '@angular/core';
import {
  SESSION_LS_NAME,
  STORAGE_LS_ADMON,
  STORAGE_LS_USER,
} from '../../models/generic/conts';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ClientServices } from '../../services/client.services/client.services';
import { LocalStorageServices } from '../../services/auth.services/localStorage.Services';
import { MatDialog } from '@angular/material/dialog';
import { EncryptionService } from '../../services/encryption.service';
import { GenericListService } from '../../services/generic.services/genericList.services';
import { ClientCreateComponent } from '../client.create/client.create.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-client.board',
  standalone: false,
  templateUrl: './client.board.component.html',
  styleUrl: './client.board.component.scss',
})
export class ClientBoardComponent {
  form!: FormGroup;
  dataSent: any;
  authParams: any;

  dataSource: any[] = [];
  option: any;

  user: string = '';
  name: string = '';
  role: string = '';
  isAdmin: boolean = true;
  responseMessage: string | null = null;

  // Configuración de paginación
  itemsPerPage: number = 5;
  currentPage: number = 1;
  paginatedData: any[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private clientServices: ClientServices,
    private localStorageServices: LocalStorageServices,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private encryptionService: EncryptionService
  ) {
    this.form = this.fb.group({
      sites: ['', Validators.required],
      services: ['', Validators.required],
      locations: [''],
    });
  }

  ngOnInit(): void {
    // Leer el array del localStorage
    const encryptedSession = localStorage.getItem(SESSION_LS_NAME);
    if (encryptedSession) {
      const storedData = this.encryptionService.decryptToken(encryptedSession);
      this.dataSent = storedData ? JSON.parse(storedData) : [];
      this.user = this.dataSent.email;
      this.name = this.dataSent.name;
      this.role = this.dataSent.userTypeDescription;
      this.isAdmin = this.dataSent.userType == STORAGE_LS_ADMON;
    }
  }

  ngAfterViewInit() {
    this.getData();
  }

  private getData() {
    this.clientServices.GetAllClients().subscribe((res) => {
      if (res.isSuccessful) {
        this.dataSource = Object.assign([], [...res.result]);
        this.updatePagination();
      } else {
        this.responseMessage = res.isError ? res.errorMessage : res.message;
        this.showSnackbar();
      }
    });
  }

  addClient() {
    const dialogRef = this.dialog.open(ClientCreateComponent, {
      width: '80%',
      data: {
        title: 'Crear Cliente',
        isEdit: false,
      },
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getData();
      }
    });
  }

  editClient(row: any) {
    const encryptedPatient = this.encryptionService.encryptToken(
      JSON.stringify(row)
    );
    this.localStorageServices.setLocalData(STORAGE_LS_USER, encryptedPatient);

    const dialogRef = this.dialog.open(ClientCreateComponent, {
      width: '80%',
      data: {
        title: 'Editar Cliente',
        user: row,
        isEdit: true,
      },
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getData();
      }
    });
  }

  petDetail(row: any) {
    const encryptedPatient = this.encryptionService.encryptToken(
      JSON.stringify(row)
    );
    this.localStorageServices.setLocalData(STORAGE_LS_USER, encryptedPatient);

    /* const dialogRef = this.dialog.open(PetCreateComponent, {
      width: '95%',
      height: '90%',
      data: {
        title: "Mascotas",
        client: row,
        isEdit: false
      },
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getData();
      } 
    });
*/
  }

  changeState(row: any) {
    this.clientServices.ChangeState(row.id).subscribe((res) => {
      if (res.isSuccessful) {
        this.getData();
      } else {
        this.responseMessage = res.isError ? res.errorMessage : res.message;
        this.showSnackbar();
      }
    });
  }

  cancel() {
    this.router.navigateByUrl('/menu');
  }

  ResetValues() {
    this.paginatedData = [];
    this.dataSource = [];
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
