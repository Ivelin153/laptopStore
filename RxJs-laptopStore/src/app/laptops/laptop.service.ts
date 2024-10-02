import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, catchError, combineLatest, delay, filter, map, shareReplay, switchMap, tap, throwError } from 'rxjs';
import { Laptop, PeripheralDevice } from './laptop';

@Injectable({
    providedIn: 'root'
})
export class LaptopService {
    private url = 'https://localhost:7045/api/laptops';
    private devicesUrl = 'https://localhost:7045/api/peripheralDevices';

    http = inject(HttpClient);

    // Action stream
    private laptopSelectedSubject = new BehaviorSubject<string>('');
    laptopSelected$ = this.laptopSelectedSubject.asObservable();

    laptops$ = this.http.get<Laptop[]>(this.url).pipe(
        shareReplay(1),
        catchError(this.handleError)
    );

    laptopSelected(modelName: string) {
        this.laptopSelectedSubject.next(modelName);
    }

    selectedLaptop$ = combineLatest([
        this.laptops$,
        this.laptopSelected$
    ]).pipe(
        map(([laptops, modelName]) => laptops.find((v) => v.model === modelName)),
        tap(() => this.isDevicesLoading.next(true)),
    );

    private isDevicesLoading = new BehaviorSubject<boolean>(false);
    isDevicesLoading$ = this.isDevicesLoading.asObservable();

    peripheralDevices$ = this.selectedLaptop$.pipe(
        // Ensure a valid laptop is selected
        filter(Boolean),
        // Trigger loading state
        tap(() => this.isDevicesLoading.next(true)),
        delay(2000),
        // Fetch devices for the selected laptop
        switchMap(laptop => this.http.get<PeripheralDevice[]>(`${this.devicesUrl}/${laptop.id}`).pipe(
            // Handle successful response and stop the loading spinner
            tap(() => this.isDevicesLoading.next(false)),
            // Catch and handle errors (also stop loading in case of error)
            catchError(this.handleError),
        )
        )
    );

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
