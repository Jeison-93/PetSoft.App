import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserBoardComponent } from './user.board/user.board.component';
import { UserCreateComponent } from './user.create/user.create.component';
import { RouterModule, Routes } from '@angular/router';
import { ClientBoardComponent } from './client.board/client.board.component';

const routes: Routes = [
  { path: 'userBoard', component: UserBoardComponent },
  { path: 'userCreate', component: UserCreateComponent },
  { path: 'clientBoard', component: ClientBoardComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComponentsRoutingModule {}
