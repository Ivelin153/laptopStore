import { Component, inject } from '@angular/core';
import { map } from 'rxjs';
import { CartService } from './cart/cart.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Accedia Laptop Store with RxJs';
  cartService = inject(CartService);

  cartCount$ = this.cartService.cartItems$.pipe(
    map(items => items.reduce((acc, item) => acc + item.quantity, 0))
  );
}
