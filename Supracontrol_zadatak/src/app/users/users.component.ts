import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { UsersService } from '../services/users.service';
import { User } from '../models/user.model';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

import * as countryData from '../../assets/countries-towns.json';
import { DxDataGridComponent } from 'devextreme-angular';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements AfterViewInit, OnInit{

  users: User[] = [];
  newUser: User;
  masterSelected: boolean = false;
  searchBtn!: HTMLElement;
  searchInput!: HTMLInputElement;
  searchWrapper!: HTMLElement;
  isPopupVisible: boolean = false;
  userForma: FormGroup;
  countries: string[] = [];
  towns: { name: string; country: string }[] = [];
  searchText: string;
  titlePopup: string = '';
  roleFilter: string = '';
  drzavaFilter: string = '';
  isPasswordVisible: boolean = false;
  isNewPasswordVisible: boolean = false;

  @ViewChild('usersGrid', { static: false }) usersGrid: DxDataGridComponent;
textPopup: any;

  ngAfterViewInit(): void {
    // Grab elements after view initialization
    this.searchBtn = document.getElementById('searchBtn')!;
    this.searchInput = document.getElementById('searchInput') as HTMLInputElement;
    this.searchWrapper = document.querySelector('.search-wrapper')!;

    // Attach event listener for search button
    this.searchBtn.addEventListener('click', (e: Event) => this.toggleSearchInput(e));
  }
  constructor(private usersService: UsersService, private authenticationService: AuthenticationService, private router: Router) { }

    ngOnInit(): void {
      this.usersService.getUsers().subscribe((data: any) => {
        this.users = data.map(user => ({
          id: user.Id,
          ime: user.FirstName || "-",
          prezime: user.LastName || "-",
          email: user.Email || "-",
          telefon: user.Phone || "-",
          role: user.Roles?.map(r => r.Name).join(', ') || "-",
          radnoMjesto: user.Workplace || "-",
          drzava: user.Country || "-",
          grad: user.City || "-"
        }));
        console.log(this.users);
      },
      err=>{
        console.log(err);
        this.router.navigateByUrl('/login');
      });

      this.userForma = new FormGroup(
        {
          'id': new FormControl(null), 
          'ime': new FormControl(null, Validators.required),
          'prezime': new FormControl(null, Validators.required,),
          'spol': new FormControl(null,[]),
          'radnoMjesto': new FormControl(null, Validators.required),
          'biljeske': new FormControl(null, []),
          'email': new FormControl(null, [Validators.required,Validators.email]),
          'telefon': new FormControl(null,[]),
          'drzava': new FormControl(null, Validators.required),
          'grad': new FormControl(null, Validators.required),
          'adresa': new FormControl(null, []),
          'korisnickoIme': new FormControl(null, Validators.required),
          'lozinka': new FormControl(null, []),
          'novaLozinka': new FormControl(null, []),
          'role1': new FormControl(false, []),
          'role2': new FormControl(false, []),
        },
        { validators: [this.matchPasswords('lozinka', 'novaLozinka'), this.atLeastOneRoleSelected()] }
        );

        this.countries = (countryData as any).default.countries;
        this.towns = (countryData as any).default.towns;
    }

    get selectedCountry(): string {
      return this.userForma.get('drzava')?.value;
    }

    toggleSearchInput(event: Event): void {
      event.preventDefault();
      this.searchWrapper.classList.toggle('active');
      if (this.searchWrapper.classList.contains('active')) {
        this.searchInput.focus();
      }
    }

    togglePopup(): void {
      this.isPopupVisible = !this.isPopupVisible;
      this.titlePopup = 'DODAJ KORISNIKA';      
    }

    private generateUniqueId(): string {
      return Math.random().toString(36).substr(2, 9);
    }

    addNewUser(): void {
      if (this.userForma.valid) {

        const role1 = this.userForma.get('role1')?.value;
        const role2 = this.userForma.get('role2')?.value;

        this.newUser = {
          id: this.userForma.get('id')?.value || this.generateUniqueId(), // Generate a unique ID
          ime: this.userForma.get('ime')?.value,
          prezime: this.userForma.get('prezime')?.value,
          spol: this.userForma.get('spol')?.value,
          radnoMjesto: this.userForma.get('radnoMjesto')?.value || "-",
          email: this.userForma.get('email')?.value,
          telefon: this.userForma.get('telefon')?.value || "-",
          role: `${role1 ? 'Administrator' : ''}${role1 && role2 ? ', ' : ''}${role2 ? 'User' : ''}`, // Join multiple roles into a string
          drzava: this.userForma.get('drzava')?.value,
          grad: this.userForma.get('grad')?.value,
          adresa: this.userForma.get('atresa')?.value || "-",
          korisnickoIme: this.userForma.get('korisnickoIme')?.value || "-",
          biljeske: this.userForma.get('biljeske')?.value || "-",
        };
        
        let index = this.users.findIndex(user => user.id == this.newUser.id);

        if(index == -1){
          this.users.push(this.newUser);
        }else{
          this.users[index] = this.newUser;
        }
        this.isPopupVisible = !this.isPopupVisible;
        console.log('New user added:', this.newUser);
      } else {
        console.log('Form is invalid');
      }
    }

    // Custom validator for Role
    atLeastOneRoleSelected(): ValidatorFn {
      return (formGroup: AbstractControl): ValidationErrors | null => {
        const role1 = formGroup.get('role1')?.value;
        const role2 = formGroup.get('role2')?.value;
  
        return role1 || role2 ? null : { atLeastOneRoleRequired: true };
      };
    }

    // Custom validator for matching passwords
    matchPasswords(controlName: string, matchingControlName: string): ValidatorFn {
      return (formGroup: AbstractControl): ValidationErrors | null => {
        const control = formGroup.get(controlName);
        const matchingControl = formGroup.get(matchingControlName);

        if (!control || !matchingControl) {
          return null; // Controls are not yet initialized
        }

        if (matchingControl.errors && !matchingControl.errors['passwordMismatch']) {
          return null; // Skip if another validator has already marked this control invalid
        }

        if (control.value !== matchingControl.value) {
          matchingControl.setErrors({ passwordMismatch: true });
        } else {
          matchingControl.setErrors(null);
        }

        return null;
      };
    }

  selectedUsers: string[]= [];

  onSelectionChanged(e: any): void {
    // Retrieve selected row data and map it to an array of id values
    this.selectedUsers = this.usersGrid.instance.getSelectedRowsData().map(user => user.id);
    console.log(this.selectedUsers);
    
  }

  onDelete() {
    console.log('on delete');
    console.log(this.users);
    console.log(this.selectedUsers);
    
    this.users = this.users.filter(user => !this.selectedUsers.includes(user.id));
    this.usersGrid.instance.refresh();
  }
  
  editedUser: User;

  onEdit() {
    this.titlePopup = 'UREĐIVANJE KORISNIKA'
    let index = this.users.findIndex(user=>user.id==this.selectedUsers[0]);

    if(index == -1){
      return;
    }
    this.editedUser = this.users[index];
    console.log('edited user;', this.editedUser);

    this.userForma.patchValue({
      id: this.editedUser.id,
      ime: this.editedUser.ime,
      prezime: this.editedUser.prezime,
      spol: this.editedUser.spol,
      email: this.editedUser.email,
      telefon: this.editedUser.telefon !== "-" ? this.editedUser.telefon : null,
      role1: this.editedUser.role.includes('Administrator'),
      role2: this.editedUser.role.includes('User'),
      radnoMjesto: this.editedUser.radnoMjesto,
      drzava: this.editedUser.drzava,
      grad: this.editedUser.grad,
      adresa: this.editedUser.adresa,
      korisnickoIme: this.editedUser.korisnickoIme,
      biljeske: this.editedUser.biljeske !== "-" ? this.editedUser.biljeske : null
    });

    this.isPopupVisible = !this.isPopupVisible;
  }

  onPopupHidden(e: any): void {
    this.userForma.reset();
  }

  logout() {
    this.authenticationService.logout();
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  toggleNewPasswordVisibility(): void {
    this.isNewPasswordVisible = !this.isNewPasswordVisible;
  }
}
