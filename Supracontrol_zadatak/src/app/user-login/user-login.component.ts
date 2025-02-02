import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit{
  loginForma: FormGroup;
  setOnSubmit: boolean = false;
  apiUrl: string = 'https://dev.supracontrol.com:8080/api/user/authenticate';

  constructor(private authenticationService: AuthenticationService) {
  }

  ngOnInit() {
    this.loginForma = new FormGroup({
      'username': new FormControl(null, [Validators.required, Validators.minLength(4)]),
      'password': new FormControl(null, [
          Validators.required,
          Validators.minLength(8),
        ])
    })      
  }


  onSubmit() {
    this.setOnSubmit = true;
    if (!this.loginForma.valid) {
      console.log('Form is invalid');
      return;
    }
    const loginData = {
      username: this.loginForma.get('username')?.value,
      password: this.loginForma.get('password')?.value
    };

    const credentials = btoa(`${loginData.username}:${loginData.password}`);
    
    console.log(loginData);
    this.authenticationService.login(credentials);
  }
  
  isPasswordVisible: boolean = false;
  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

}
