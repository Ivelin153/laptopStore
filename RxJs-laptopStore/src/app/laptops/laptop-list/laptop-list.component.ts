import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, inject, Input, SimpleChanges } from '@angular/core';
import { catchError, distinctUntilChanged, EMPTY, map, Observable } from 'rxjs';
import { Laptop } from '../laptop';
import { LaptopService } from '../laptop.service';

@Component({
  selector: 'app-laptop-list',
  standalone: true,
  imports: [AsyncPipe, NgClass, NgFor, NgIf],
  templateUrl: './laptop-list.component.html',
})
export class LaptopListComponent {
  pageTitle = 'Laptops';
  errorMessage = '';

  @Input() filterCriteria = '';

  laptopService = inject(LaptopService);

  filteredLaptops$: Observable<Laptop[]> = this.laptopService.laptops$;
  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      this.filteredLaptops$ = this.laptopService.laptops$
        .pipe(
          distinctUntilChanged(),
          map((laptops) => {
            return laptops
              .filter(l => l.brand
                .toLocaleLowerCase()
                .includes(this.filterCriteria.toLocaleLowerCase()));
          }),
          catchError(err => {
            this.errorMessage = err;
            return EMPTY;
          }));
    }
  }

  selectedLaptop$ = this.laptopService.selectedLaptop$.pipe(
    catchError(err => {
      this.errorMessage = err;
      return EMPTY;
    })
  );

  // When a laptop is selected, emit the selected laptop name
  onSelected(modelName: string): void {
    this.laptopService.laptopSelected(modelName);
  }
}
