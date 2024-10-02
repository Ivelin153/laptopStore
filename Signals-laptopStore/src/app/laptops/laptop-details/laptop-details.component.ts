import { AsyncPipe, DecimalPipe, NgFor, NgIf } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { CartService } from '../../cart/cart.service';
import { LaptopService } from '../laptop.service';
import { Laptop } from './../laptop';

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

  laptop = this.laptopService.selectedLaptop;
  peripheralDevices = this.laptopService.compatiblePeripheralDevices;
  isLoading = this.laptopService.loadingCompatibleDevices;

  pageTitle = computed(() => this.laptop() ? `Detail for: ${this.laptop()?.brand} - ${this.laptop()?.model}` : '');

  addToCart(laptop: Laptop | undefined) {
    if (laptop)
      this.cartService.addToCart(laptop);
  }
}
