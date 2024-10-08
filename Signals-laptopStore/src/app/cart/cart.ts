import { Laptop } from './../laptops/laptop';

export interface Cart {
  cartItems: CartItem[]
}

export interface CartItem {
  laptop: Laptop;
  quantity: number;
}

// You could move this to a shared file
// and reuse it for every entity in the application
type ActionType = 'add' | 'update' | 'delete';

export interface Action<T> {
  item: T;
  action: ActionType;
}
