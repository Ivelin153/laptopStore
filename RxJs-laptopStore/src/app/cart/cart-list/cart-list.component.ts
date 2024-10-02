import { AsyncPipe, NgFor } from '@angular/common';
import { Component } from '@angular/core';

import { CartItemComponent } from "../cart-item/cart-item.component";
import { CartService } from '../cart.service';

@Component({
  selector: 'app-cart-list',
  standalone: true,
  template: `
  <div *ngFor="let item of cartItems$ | async">
     <app-cart-item [item]='item'></app-cart-item>
  </div>
  `,
  imports: [AsyncPipe, NgFor, CartItemComponent]
})
export class CartListComponent {
  cartItems$ = this.cartService.cartItems$;

  constructor(private cartService: CartService) { }
}
