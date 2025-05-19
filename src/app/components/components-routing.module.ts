import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserBoardComponent } from './user.board/user.board.component';
import { UserCreateComponent } from './user.create/user.create.component';
import { RouterModule, Routes } from '@angular/router';
import { ClientBoardComponent } from './client.board/client.board.component';
import { ServicesBoardComponent } from './services.board/services.board.component';
import { ServicesCreateComponent } from './services.create/services.create.component';
import { ServicesManagementComponent } from './services.management/services.management.component';

const routes: Routes = [
  { path: 'userBoard', component: UserBoardComponent },
  { path: 'userCreate', component: UserCreateComponent },
  { path: 'clientBoard', component: ClientBoardComponent },
  { path: 'servicesBoard', component: ServicesBoardComponent },
  { path: 'servicesCreate', component: ServicesCreateComponent },
  { path: 'servicesManagement', component: ServicesManagementComponent },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComponentsRoutingModule {}
