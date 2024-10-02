import { Injectable, computed, signal } from "@angular/core";
import { Laptop } from "../laptops/laptop";
import { CartItem } from "./cart";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems = signal<CartItem[]>([]);

  // Total up the extended price for each item
  subTotal = computed(() =>
    this.cartItems().reduce((a, b) => a + (b.quantity * b.laptop.price), 0)
  );

  // Delivery is free if spending more than 1000 $
  deliveryFee = computed(() =>
    this.subTotal() < 1000 ? 10 : 0
  );

  // Tax could be based on shipping address zip code
  tax = computed(() =>
    Math.round(this.subTotal() * 20) / 100
  );

  totalPrice = computed(() => {
    return this.subTotal() + this.deliveryFee() + this.tax()
  });

  // Add the laptop to the cart as an Action<CartItem>
  addToCart(laptop: Laptop): void {
    this.cartItems.update(items => [...items, { laptop, quantity: 1 }]);
  }

  // Remove the item from the cart
  removeFromCart(cartItem: CartItem): void {
    this.cartItems.update(items => items.filter(item => item.laptop.id !== cartItem.laptop.id));
  }

  updateInCart(cartItem: CartItem, quantity: number) {
    this.cartItems.update((items: CartItem[]) =>
      items.map((item: CartItem) => {
        return item.laptop.id === cartItem.laptop.id ? { laptop: cartItem.laptop, quantity } : item
      }))
  }
}
