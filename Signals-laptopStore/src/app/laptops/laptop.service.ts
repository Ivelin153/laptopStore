import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Observable, catchError, delay, filter, shareReplay, switchMap, tap, throwError } from 'rxjs';
import { Laptop, PeripheralDevice } from './laptop';

@Injectable({
    providedIn: 'root'
})
export class LaptopService {
    private laptopsUrl = 'https://localhost:7045/api/laptops';
    private devicesUrl = 'https://localhost:7045/api/peripheralDevices';
    http = inject(HttpClient);

    private laptops$ = this.http.get<Laptop[]>(this.laptopsUrl).pipe(
        shareReplay(1),
        catchError(this.handleError)
    );

    // Directly assign value for signal without specifing type
    loadingCompatibleDevices = signal(false);

    // Specify type and set initial value 
    selectedLaptop = signal<Laptop | undefined>(undefined);

    // Create signal from an observable, again setting the initial value
    laptops = toSignal(this.laptops$, { initialValue: [] });

    // Converting the signal back to observable to make use of async operation handling.
    private laptopPeripheralDevices$ = toObservable(this.selectedLaptop).pipe(
        filter(Boolean),
        tap(() => this.loadingCompatibleDevices.set(true)), // Set loading to true before API call
        delay(2000),
        switchMap(laptop =>
            this.http.get<PeripheralDevice[]>(`${this.devicesUrl}/${laptop.id}`).pipe(
                catchError(this.handleError), // Handle any errors that might occur during the API call
                tap(() => this.loadingCompatibleDevices.set(false)) // Set loading to false after API call completes
            )
        )
    );

    compatiblePeripheralDevices = toSignal<PeripheralDevice[], PeripheralDevice[]>(this.laptopPeripheralDevices$, { initialValue: [] });

    laptopSelected(modelName: string) {
        const selectedLaptop = this.laptops().find(l => l.model === modelName);
        this.selectedLaptop.set(selectedLaptop);
    }

    private handleError(err: HttpErrorResponse): Observable<never> {
        // in a real world app, we may send the server to some remote logging infrastructure
        // instead of just logging it to the console
        let errorMessage = '';
        if (err.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            errorMessage = `An error occurred: ${err.error.message}`;
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            errorMessage = `Server returned code: ${err.status}, error message is: ${err.message
                }`;
        }
        console.error(errorMessage);

        return throwError(() => errorMessage);
    }
}
