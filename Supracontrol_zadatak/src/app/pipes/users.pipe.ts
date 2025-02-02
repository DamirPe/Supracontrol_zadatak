import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'users'
})
export class UsersPipe implements PipeTransform {

  transform(users: any[], searchText: string, role: string, country: string): any[] {
    if (!users) {
      return [];
    }
    if (!searchText && !role && !country) {
      return users; // No filters applied, return all users
    }

    // Convert search text to lowercase for a case-insensitive search
    const lowerSearchText = searchText ? searchText.toLowerCase() : '';
    const lowerRole = role ? role.toLowerCase() : '';
    const lowerCountry = country ? country.toLowerCase() : '';

    // Filter the users array
    return users.filter(user => {
      const matchesSearchText =
        (user.ime && user.ime.toLowerCase().includes(lowerSearchText)) ||
        (user.prezime && user.prezime.toLowerCase().includes(lowerSearchText)) ||
        (user.radnoMjesto && user.radnoMjesto.toLowerCase().includes(lowerSearchText));

      const matchesRole = lowerRole ? user.role.toLowerCase().split(', ').includes(lowerRole) : true;

      const matchesCountry = lowerCountry ? user.drzava.toLowerCase().includes(lowerCountry) : true;

      return matchesSearchText && matchesRole && matchesCountry;
    });
  }

}
