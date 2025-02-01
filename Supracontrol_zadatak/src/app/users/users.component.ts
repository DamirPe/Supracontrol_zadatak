import { AfterViewInit, Component, OnInit } from '@angular/core';
import { UsersService } from '../services/users.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements AfterViewInit, OnInit{

  users: User[] = [];
  masterSelected: boolean = false;
  searchBtn!: HTMLElement;
  searchInput!: HTMLInputElement;
  searchWrapper!: HTMLElement;
  isPopupVisible: boolean;

  ngAfterViewInit(): void {
    // Grab elements after view initialization
    this.searchBtn = document.getElementById('searchBtn')!;
    this.searchInput = document.getElementById('searchInput') as HTMLInputElement;
    this.searchWrapper = document.querySelector('.search-wrapper')!;

    // Attach event listener for search button
    this.searchBtn.addEventListener('click', (e: Event) => this.toggleSearchInput(e));
  }
  constructor(private usersService: UsersService) { }
    ngOnInit(): void {
      this.isPopupVisible = true;

      this.usersService.getUsers().subscribe((data: any) => {
        this.users = data.map(user => ({
          selected: false,
          id: user.Id,
          ime: user.FirstName || "-",
          prezime: user.LastName || "-",
          email: user.Email || "-",
          telefon: user.Phone || "",
          role: user.Roles?.map(r => r.Name).join(', ') || "-",
          radnoMjesto: user.Workplace || "-",
          drzava: user.Country || "-",
          grad: user.City || "-"
        }));
        console.log(this.users);
      },
      err=>{
        console.log(err);
      });
    }

    toggleAllCheckboxes(value: boolean) {
      this.masterSelected = value;
      this.users.forEach(user => user.selected = value);
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
      console.log('test');
      
    }
}
