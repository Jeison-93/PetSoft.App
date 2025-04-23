import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsRoutingModule } from '../components-routing.module';
import { MenuComponent } from './menu/menu.component';
import { LoginComponent } from './login/login.component';



@NgModule({
  declarations: [
    MenuComponent,
    LoginComponent
  ],
  imports: [
    CommonModule,
    ComponentsRoutingModule
  ]
})
export class ComponentsModule { }
