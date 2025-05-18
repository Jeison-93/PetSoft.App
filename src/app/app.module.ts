import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserBoardComponent } from './components/user.board/user.board.component';

import { MenuModule } from './components/menu/menu.module';
import { ComponentsModule } from './components/components.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginModule } from './components/login/login.module';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTimepickerModule } from '@angular/material/timepicker';

@NgModule({
  declarations: [AppComponent, UserBoardComponent],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    LoginModule,
    MenuModule,
    ComponentsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatGridListModule,
    MatTooltip,
    MatTooltipModule,
    MatTableModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatIconModule,
    MatNativeDateModule,
    MatTimepickerModule,
    MatDatepickerModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
