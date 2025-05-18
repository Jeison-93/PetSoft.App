import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserBoardComponent } from './user.board/user.board.component';
import { UserCreateComponent } from './user.create/user.create.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'userboard', component: UserBoardComponent },
  { path: 'userCreate', component: UserCreateComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComponentsRoutingModule {}
