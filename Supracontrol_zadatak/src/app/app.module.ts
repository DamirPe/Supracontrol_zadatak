import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UserLoginComponent } from './user-login/user-login.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { UsersComponent } from './users/users.component';
import { JwtInterceptor } from './helpers/jwt.interceptors';
import { DxDataGridModule, DxCheckBoxModule, DxPopupModule } from 'devextreme-angular';


@NgModule({
  declarations: [
    AppComponent,
    UserLoginComponent,
    UsersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    DxDataGridModule,
    DxCheckBoxModule,
    DxPopupModule,
    HttpClientModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true,
  },],
  bootstrap: [AppComponent]
})
export class AppModule { }
