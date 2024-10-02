import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LaptopDetailsComponent } from '../laptop-details/laptop-details.component';
import { LaptopListComponent } from '../laptop-list/laptop-list.component';

@Component({
    selector: 'app-laptop-container',
    standalone: true,
    templateUrl: './laptop-container.component.html',
    imports: [LaptopListComponent, LaptopDetailsComponent, FormsModule],
})
export class LaptopContainerComponent {
    laptopsFilter: string = '';
}
