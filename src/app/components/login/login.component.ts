import { Component, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServices } from '../../services/auth.services/auth.services';
import { LocalStorageServices } from '../../services/auth.services/localStorage.Services';
import { EncryptionService } from '../../services/encryption.service';
import {
  SESSION_LS_NAME,
  STORAGE_LS_AUX,
  STORAGE_LS_VET,
} from '../../models/generic/conts';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm!: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private renderer: Renderer2,
    private authServices: AuthServices,
    private localStorageServices: LocalStorageServices,
    private encryptionService: EncryptionService
  ) {
    this.loginForm = this.fb.group({
      user: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }
  ngOnInit() {
    this.renderer.addClass(document.body, 'home-background');
  }

  ngOnDestroy() {
    // Limpia la clase o estilo cuando se destruye el componente
    this.renderer.removeClass(document.body, 'home-background');
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loginForm.patchValue({
        password: this.encryptionService.encryptPassword(
          this.loginForm.value.password
        ),
      });

      this.authServices
        .RequestLogin(this.loginForm.value)
        .subscribe((response) => {
          if (response.isSuccessful) {
            this.setLocalStorage(response.result);

            if (STORAGE_LS_VET == response.result.userType)
              this.router.navigateByUrl('/menu/menulist/servicesManagement', {
                skipLocationChange: true,
              });
            else
              this.router.navigateByUrl('/menu', {
                skipLocationChange: true,
              });
          } else {
            this.errorMessage = response.message;
            this.showSnackbar();
            this.loginForm.patchValue({
              password: '',
            });
          }
        });
    } else {
      this.errorMessage = 'Credenciales incorrectas';
      this.showSnackbar();
    }
  }

  setLocalStorage(user: any) {
    const token = 'token';
    const encryptedToken = this.encryptionService.encryptToken(token);
    this.authServices.setToken(encryptedToken); // Guardar el token
    const encriptedSessionData = this.encryptionService.encryptToken(
      JSON.stringify(user)
    );
    this.localStorageServices.setLocalData(
      SESSION_LS_NAME,
      encriptedSessionData
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
