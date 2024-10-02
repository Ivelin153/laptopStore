import { AsyncPipe, DecimalPipe, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EMPTY, catchError, map } from 'rxjs';
import { CartService } from '../../cart/cart.service';
import { LaptopService } from '../laptop.service';
import { Laptop, PeripheralDevice } from './../laptop';

@Component({
  selector: 'app-laptop-details',
  standalone: true,
  imports: [AsyncPipe, NgFor, NgIf, DecimalPipe],
  templateUrl: './laptop-details.component.html',
  styleUrl: './laptop-details.component.scss'
})
export class LaptopDetailsComponent {
  errorMessage = '';
  cartService = inject(CartService);
  laptopService = inject(LaptopService);

  devices: PeripheralDevice[] = [];

  laptop$ = this.laptopService.selectedLaptop$.pipe(
    catchError(err => {
      this.errorMessage = err;
      return EMPTY;
    })
  );

  pageTitle$ = this.laptop$.pipe(
    map(laptop => laptop ? `Detail for: ${laptop.brand} - ${laptop.model}` : '')
  )

  isLoading$ = this.laptopService.isDevicesLoading$;
  peripheralDevices$ = this.laptopService.peripheralDevices$.pipe(
    takeUntilDestroyed(),
    catchError(err => {
      this.errorMessage = err;
      return EMPTY;
    }),
  ).subscribe((devices) => {
    this.devices = devices;
  })

  addToCart(laptop: Laptop) {
    this.cartService.addToCart(laptop);
  }
}
