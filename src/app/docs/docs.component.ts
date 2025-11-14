import { Component } from '@angular/core';
import { ClrAccordionModule, ClrConditionalModule } from '@clr/angular';

@Component({
    selector: 'app-ride-docs',
    templateUrl: './docs.component.html',
    imports: [ClrAccordionModule, ClrConditionalModule]
})
export class DocsComponent {

}
