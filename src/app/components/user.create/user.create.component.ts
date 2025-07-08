import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GenericListService } from '../../services/generic.services/genericList.services';
import { EncryptionService } from '../../services/encryption.service';
import { UserServices } from '../../services/user.services/user.services';
import { GenericList } from '../../models/generic/generic.model';
import {
  MapperRequestUpdateUserDTO,
  MapperRequestUserDTO,
} from '../../utils/mapper.functions';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user.create',
  standalone: false,
  templateUrl: './user.create.component.html',
  styleUrl: './user.create.component.scss',
})
export class UserCreateComponent implements OnInit {
  form: FormGroup;
  dataSent: any;
  dataSession: any;
  documentTypeList: GenericList[] = [];
  userTypeList: GenericList[] = [];
  responseMessage: string | null = null;
  showModal: string = '50%';

  constructor(
    private fb: FormBuilder,
    private genericListServices: GenericListService,
    private userServices: UserServices,
    private encryptionService: EncryptionService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<UserCreateComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { title: string; user: any; isEdit: boolean }
  ) {
    this.form = this.fb.group({
      documentType: ['', Validators.required],
      documentNumber: ['', Validators.required],
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.email]],
      password: [''],
      phone: [''],
      addresss: [''],
      userType: ['', Validators.required],
    });

    if (data.isEdit) {
      this.form.patchValue({
        documentType: this.data.user.documentType,
        documentNumber: this.data.user.documentNumber,
        name: this.data.user.name,
        lastName: this.data.user.lastName,
        email: this.data.user.email,
        password: this.encryptionService.decryptPassword(
          this.data.user.password
        ),
        phone: this.data.user.phone,
        addresss: this.data.user.addresss,
        userType: this.data.user.userType,
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

    this.genericListServices.GetGenericTable('UserType').subscribe((res) => {
      if (res.isSuccessful) {
        this.userTypeList = Object.assign([], [...res.result]);
      } else {
        this.responseMessage = res.isError ? res.errorMessage : res.message;
        this.showSnackbar();
      }
    });
  }

  Save() {
    if (this.form.valid) {
      this.form.patchValue({
        password: this.encryptionService.encryptPassword(
          this.form.value.password
        ),
      });
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
    this.userServices
      .Save(MapperRequestUserDTO(this.form.value))
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
      this.userServices
        .Update(MapperRequestUpdateUserDTO(this.form.value, this.data.user.id))
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
