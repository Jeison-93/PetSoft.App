import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  usuario: string = ''; // Asegurar que 'usuario' existe
  password: string = ''; // Declarar 'password'
  login() {
    console.log('Usuario:', this.usuario);
    console.log('Contraseña:', this.password);
  }
}
