import { AsyncPipe, CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { LaptopService } from '../laptop.service';

@Component({
  selector: 'app-laptop-list',
  standalone: true,
  imports: [AsyncPipe, NgClass, NgFor, NgIf, CommonModule],
  templateUrl: './laptop-list.component.html'
})
export class LaptopListComponent {
  filterCriteria = input.required({
    alias: 'filter',
    transform: (value: string) => value.toLocaleLowerCase()
  });

  // filterModel = model('');

  pageTitle = 'Laptops';
  errorMessage = '';

  laptopService = inject(LaptopService);

  // Laptops
  laptops = this.laptopService.laptops;


  filteredLaptops = computed(() =>
    this.laptops().filter(s => s.brand.toLocaleLowerCase().includes(this.filterCriteria()))
  )

  selectedLaptop = this.laptopService.selectedLaptop;

  onSelected(modelName: string): void {
    this.laptopService.laptopSelected(modelName);
  }
}
