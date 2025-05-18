import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  SESSION_LS_NAME,
  STORAGE_LS_ADMON,
  STORAGE_LS_USER,
} from '../../models/generic/conts';
import { EncryptionService } from '../../services/encryption.service';
import { MatDialog } from '@angular/material/dialog';
import { LocalStorageServices } from '../../services/auth.services/localStorage.Services';
import { UserServices } from '../../services/user.services/user.services';
import { GenericListService } from '../../services/generic.services/genericList.services';
import { UserCreateComponent } from '../user.create/user.create.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user',
  standalone: false,
  templateUrl: './user.board.component.html',
  styleUrl: './user.board.component.scss',
})
export class UserBoardComponent {
  form!: FormGroup;
  dataSent: any;
  authParams: any;

  dataSource: any[] = [];
  option: any;

  user: string = '';
  name: string = '';
  role: string = '';
  isAdmin: boolean = true;
  errorMessage: string | null = null;

  // Configuración de paginación
  itemsPerPage: number = 5;
  currentPage: number = 1;
  paginatedData: any[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userServices: UserServices,
    private localStorageServices: LocalStorageServices,
    private genericListServices: GenericListService,
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
    this.userServices.GetAllUser().subscribe((res) => {
      if (res.isSuccessful) {
        this.dataSource = Object.assign([], [...res.result]);
        this.updatePagination();
      } else {
        this.errorMessage = res.isError ? res.errorMessage : res.message;
        this.showSnackbar();
      }
    });
  }

  addUser() {
    const dialogRef = this.dialog.open(UserCreateComponent, {
      width: '85%',
      data: {
        title: 'Crear Usuario',
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

  editUser(row: any) {
    const encryptedPatient = this.encryptionService.encryptToken(
      JSON.stringify(row)
    );
    this.localStorageServices.setLocalData(STORAGE_LS_USER, encryptedPatient);

    const dialogRef = this.dialog.open(UserCreateComponent, {
      width: '80%',
      data: {
        title: 'Editar usuario',
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

  changeState(row: any) {
    this.userServices.ChangeState(row.id).subscribe((res) => {
      if (res.isSuccessful) {
        this.getData();
      } else {
        this.errorMessage = res.isError ? res.errorMessage : res.message;
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

  filteredData = [...this.paginatedData]; // Copia inicial de la lista

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .toLowerCase()
      .trim();
    this.filteredData = this.paginatedData.filter((pet) =>
      Object.values(pet).some((value) =>
        (value as string).toString().toLowerCase().includes(filterValue)
      )
    );
  }

  showSnackbar(): void {
    const snackbar = document.getElementById('snackbar');
    if (snackbar) {
      snackbar.className = 'snackbar show';
      setTimeout(() => {
        snackbar.className = snackbar.className.replace('show', '');
      }, 3000); // El tiempo que el snackbar permanece visible (3 segundos)
    }
  }
}
