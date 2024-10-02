import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found.component';
import { WelcomeComponent } from './welcome/welcome.component';

export const routes: Routes = [
    { path: 'welcome', component: WelcomeComponent },
    {
        path: 'laptops',
        loadComponent: () =>
            import('./laptops/laptop-container/laptop-container.component').then(c => c.LaptopContainerComponent)
    },
    {
        path: 'cart',
        loadComponent: () =>
            import('./cart/cart-shell/cart-shell.component').then(c => c.CartShellComponent)
    },
    { path: '', redirectTo: 'welcome', pathMatch: 'full' },
    { path: '**', component: PageNotFoundComponent }
];
