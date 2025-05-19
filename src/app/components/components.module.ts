import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserCreateComponent } from './user.create/user.create.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserBoardComponent } from './user.board/user.board.component';
import { ComponentsRoutingModule } from './components-routing.module';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { ClientCreateComponent } from './client.create/client.create.component';
import { ClientBoardComponent } from './client.board/client.board.component';
import { PetCreateComponent } from './pet.create/pet.create.component';
import { ServicesBoardComponent } from './services.board/services.board.component';
import { ServicesCreateComponent } from './services.create/services.create.component';
import { ServicesManagementComponent } from './services.management/services.management.component';

@NgModule({
  declarations: [UserCreateComponent, ClientCreateComponent, ClientBoardComponent, PetCreateComponent, ServicesBoardComponent, ServicesCreateComponent, ServicesManagementComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ComponentsRoutingModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCardModule,
    MatTooltip,
    MatTooltipModule,
    MatTableModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatIconModule,
    MatNativeDateModule,
    MatTimepickerModule,
    MatDatepickerModule,
  ],
})
export class ComponentsModule {}
