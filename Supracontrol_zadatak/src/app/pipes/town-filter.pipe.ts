import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'townFilter'
})
export class TownFilterPipe implements PipeTransform {

  transform(towns: { name: string; country: string }[], selectedCountry: string): { name: string; country: string }[] {
    if (!selectedCountry) return towns;
    return towns.filter(town => town.country === selectedCountry);
  }
}
