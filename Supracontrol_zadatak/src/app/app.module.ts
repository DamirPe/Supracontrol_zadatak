import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserLoginComponent } from './user-login/user-login.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { UsersComponent } from './users/users.component';
import { JwtInterceptor } from './helpers/jwt.interceptors';
import { DxDataGridModule, DxCheckBoxModule, DxPopupModule } from 'devextreme-angular';
import { TownFilterPipe } from './pipes/town-filter.pipe';
import { UsersPipe } from './pipes/users.pipe';


@NgModule({
  declarations: [
    AppComponent,
    UserLoginComponent,
    UsersComponent,
    TownFilterPipe,
    UsersPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
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
