import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserLoginComponent } from './user-login/user-login.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  {
    path: 'users', component: UsersComponent, pathMatch: "full"
  },
  {
    path: 'login', component: UserLoginComponent
  },
  { path: "**", redirectTo: "users" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
