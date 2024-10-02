import { Injectable } from "@angular/core";
import { combineLatest, map, scan, shareReplay, Subject } from "rxjs";
import { Laptop } from "../laptops/laptop";
import { Action, CartItem } from "./cart";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  // Add item action
  private itemSubject = new Subject<Action<CartItem>>();
  itemAction$ = this.itemSubject.asObservable();

  cartItems$ = this.itemAction$
    .pipe(
      scan((items, itemAction) =>
        this.modifyCart(items, itemAction), [] as CartItem[]),
      shareReplay(1)
    );

  // Total up the extended price for each item
  subTotal$ = this.cartItems$.pipe(
    map(items => items.reduce((a, b) => a + (b.quantity * Number(b.laptop.price)), 0)),
  );

  // Delivery is free if spending more than 1000
  deliveryFee$ = this.subTotal$.pipe(
    map((t) => (t < 1000 ? 10 : 0))
  );

  // Tax could be based on shipping address zip code
  tax$ = this.subTotal$.pipe(
    map((t) => Math.round(t * 10.75) / 100)
  );

  // Total price
  totalPrice$ = combineLatest([
    this.subTotal$,
    this.deliveryFee$,
    this.tax$,
  ]).pipe(map(([st, d, t]) => st + d + t));

  // Add the laptop to the cart as an Action<CartItem>
  addToCart(laptop: Laptop): void {
    this.itemSubject.next({
      item: { laptop: laptop, quantity: 1 },
      action: 'add'
    });
  }

  // Remove the item from the cart
  removeFromCart(cartItem: CartItem): void {
    this.itemSubject.next({
      item: { laptop: cartItem.laptop, quantity: 0 },
      action: 'delete'
    });
  }

  updateInCart(cartItem: CartItem, quantity: number) {
    this.itemSubject.next({
      item: { laptop: cartItem.laptop, quantity },
      action: 'update'
    });
  }

  // Return the updated array of cart items
  private modifyCart(items: CartItem[], operation: Action<CartItem>): CartItem[] {
    if (operation.action === 'add') {
      // Determine if the item is already in the cart
      const itemInCart = items.find(item => item.laptop.model === operation.item.laptop.model);
      if (itemInCart) {
        // If so, update the quantity
        itemInCart.quantity += 1;
        return items.map(item => item.laptop.model === itemInCart.laptop.model ? itemInCart : item)
      } else {
        return [...items, operation.item];
      }
    } else if (operation.action === 'update') {
      return items.map(item => item.laptop.model === operation.item.laptop.model ? operation.item : item)
    } else if (operation.action === 'delete') {
      return items.filter(item => item.laptop.model !== operation.item.laptop.model);
    }
    return [...items];
  }

}
