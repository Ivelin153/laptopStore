import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LaptopDetailsComponent } from '../laptop-details/laptop-details.component';
import { LaptopListComponent } from '../laptop-list/laptop-list.component';

@Component({
    selector: 'app-laptop-container',
    standalone: true,
    template: `
        <div class="row">
        <div class="col-md-4">Filter By:</div>
        <div class="col-md-8 text-lg-start">
            <input type="text" [(ngModel)]="laptopsFilter" />
        </div>
                </div>
                <div class='row'>
                    <div class='col-md-4'>
                        <app-laptop-list [filterCriteria]="laptopsFilter"></app-laptop-list>
                    </div>
                    <div class='col-md-8'>
                        <app-laptop-details></app-laptop-details>
                    </div>
            </div>`,
    imports: [LaptopListComponent, LaptopDetailsComponent, FormsModule],
})
export class LaptopContainerComponent {
    laptopsFilter: string = '';
}
