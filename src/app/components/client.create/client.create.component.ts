import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GenericList } from '../../models/generic/generic.model';
import { Router } from '@angular/router';
import { GenericListService } from '../../services/generic.services/genericList.services';
import { EncryptionService } from '../../services/encryption.service';
import { ClientServices } from '../../services/client.services/client.services';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  MapperRequestClientDTO,
  MapperRequestUpdateClientDTO,
} from '../../utils/mapper.functions';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-client.create',
  standalone: false,
  templateUrl: './client.create.component.html',
  styleUrl: './client.create.component.scss',
})
export class ClientCreateComponent implements OnInit {
  form: FormGroup;
  dataSent: any;
  dataSession: any;
  documentTypeList: GenericList[] = [];
  responseMessage: string | null = null;
  showModal: string = '50%';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private genericListServices: GenericListService,
    private clientServices: ClientServices,
    private encryptionService: EncryptionService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<ClientCreateComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { title: string; user: any; isEdit: boolean }
  ) {
    this.form = this.fb.group({
      documentType: ['', Validators.required],
      documentNumber: ['', Validators.required],
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.email]],
      phone: [''],
      address: [''],
    });

    if (data.isEdit) {
      this.form.patchValue({
        documentType: this.data.user.documentType,
        documentNumber: this.data.user.documentNumber,
        name: this.data.user.name,
        lastName: this.data.user.lastName,
        email: this.data.user.email,
        phone: this.data.user.phone,
        address: this.data.user.address,
      });
    }
  }
  ngOnInit(): void {
    this.getGenericList();
  }

  private getGenericList() {
    this.genericListServices
      .GetGenericTable('DocumentType')
      .subscribe((res) => {
        if (res.isSuccessful) {
          this.documentTypeList = Object.assign([], [...res.result]);
        } else {
          this.responseMessage = res.isError ? res.errorMessage : res.message;
          this.showSnackbar();
        }
      });
  }

  Save() {
    if (this.form.valid) {
      if (this.data.isEdit) {
        this.OnUpdate();
      } else {
        this.OnSave();
      }
    } else {
      this.responseMessage = 'Debe completar todos los campos requeridos';
      this.showSnackbar();
    }
  }

  OnSave() {
    this.clientServices
      .Save(MapperRequestClientDTO(this.form.value))
      .subscribe((res) => {
        if (res.isError || !res.isSuccessful) {
          this.responseMessage =
            res.errorMessage != null ? res.errorMessage : res.message;
          this.showModal = '30%';
          this.showSnackbar();
        } else {
          this.responseMessage = res.result;
          this.showModal = '50%';
          this.showSnackbar();
          setTimeout(() => {
            this.closeToSave();
          }, 3000);
        }
      });
  }

  OnUpdate() {
    if (this.form.valid) {
      this.clientServices
        .Update(
          MapperRequestUpdateClientDTO(this.form.value, this.data.user.id)
        )
        .subscribe((res) => {
          if (res.isError || !res.isSuccessful) {
            this.responseMessage =
              res.errorMessage != null ? res.errorMessage : res.message;
            this.showModal = '30%';
            this.showSnackbar();
          } else {
            this.responseMessage = res.result;
            this.showSnackbar();
            setTimeout(() => {
              this.closeToSave();
            }, 3000);
          }
        });
    } else {
      this.responseMessage = 'Debe completar todos los campos requeridos';
      this.showSnackbar();
    }
  }

  close() {
    this.dialogRef.close();
  }

  closeToSave() {
    this.dialogRef.close(this.form.value);
  }

  showSnackbar() {
    this.snackBar.open(`${this.responseMessage}`, '', {
      duration: 3000, // Duración en milisegundos
      horizontalPosition: 'center', // Opciones: 'start' | 'center' | 'end' | 'left' | 'right'
      verticalPosition: 'bottom',
    });
  }
}
