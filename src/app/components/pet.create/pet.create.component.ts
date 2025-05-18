import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PetServices } from '../../services/pet.services/pet.services';
import { GenericList } from '../../models/generic/generic.model';
import { GenericListService } from '../../services/generic.services/genericList.services';
import { MatTableDataSource } from '@angular/material/table';
import { PetModel } from '../../models/pet/petModel';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-pet.create',
  standalone: false,
  templateUrl: './pet.create.component.html',
  styleUrl: './pet.create.component.scss',
})
export class PetCreateComponent implements OnInit {
  petForm: FormGroup;

  pets: PetModel[] = [];
  responseMessage: string | null = null;
  speciesList: GenericList[] = [];
  displayedColumns: string[] = [
    'edit',
    'delete',
    'name',
    'speciesDescription',
    'breed',
    'age',
    'weight',
  ];
  selectedRow: any = null; // Guarda la fila en edición
  isEdit: boolean = false;

  constructor(
    private fb: FormBuilder,
    private petServices: PetServices,
    private genericListService: GenericListService,
    private dialogRef: MatDialogRef<PetCreateComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA)
    public data: { title: string; client: any; isEdit: boolean }
  ) {
    this.petForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      species: ['', Validators.required],
      breed: ['', Validators.required],
      age: [0, [Validators.required, Validators.min(0)]],
      weight: [0, [Validators.required, Validators.min(0)]],
      client: [],
    });

    this.petForm.patchValue({
      client: this.data.client.id,
    });
  }
  ngOnInit(): void {
    this.getData();
    this.getList();
  }

  private getData() {
    this.petServices.GetAllPets(this.data.client.id).subscribe((res) => {
      if (res.isSuccessful) {
        this.pets = Object.assign([], [...res.result]);
      }
    });
  }

  private getList() {
    this.genericListService.GetGenericTable('Species').subscribe((res) => {
      if (res.isSuccessful) {
        this.speciesList = Object.assign([], [...res.result]);
      }
    });
  }

  savePets() {
    if (this.petForm.valid) {
      if (!this.isEdit) {
        this.OnSave();
      } else {
        this.OnUpdate();
      }
    }
  }

  OnSave() {
    this.petServices.Save(this.petForm.value).subscribe((res) => {
      if (res.isError || !res.isSuccessful) {
        this.responseMessage =
          res.errorMessage != null ? res.errorMessage : res.message;
        this.openSnackBar();
      } else {
        this.responseMessage = res.result;
        this.openSnackBar();
        this.resetValues();
        this.getData();
      }
    });
  }

  OnUpdate() {
    this.petServices.Update(this.petForm.value).subscribe((res) => {
      if (res.isError || !res.isSuccessful) {
        this.responseMessage =
          res.errorMessage != null ? res.errorMessage : res.message;
        this.openSnackBar();
      } else {
        this.responseMessage = res.result;
        this.openSnackBar();
        this.resetValues();
        this.getData();
      }
    });
  }

  editRow(row: PetModel) {
    this.selectedRow = { ...row }; // Clonar para edición
    this.isEdit = true;
    this.petForm.patchValue(this.selectedRow);
  }

  deleteRow(row: PetModel) {
    this.petServices.ChangeState(row.id).subscribe((res) => {
      if (res.isError || !res.isSuccessful) {
        this.responseMessage =
          res.errorMessage != null ? res.errorMessage : res.message;
        this.openSnackBar();
      } else {
        this.responseMessage = res.result;
        this.openSnackBar();
        this.resetValues();
        this.getData();
      }
    });
  }

  resetValues() {
    this.petForm.reset();
    this.isEdit = false;
  }

  openSnackBar() {
    this.snackBar.open(`${this.responseMessage}`, '', {
      duration: 3000, // Duración en milisegundos
      horizontalPosition: 'center', // Opciones: 'start' | 'center' | 'end' | 'left' | 'right'
      verticalPosition: 'bottom',
    });
  }
}
