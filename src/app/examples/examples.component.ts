import { Component, isDevMode, output } from '@angular/core';
import { ClrAccordionModule, ClrSidePanelModule, ClrAlertModule, ClrConditionalModule } from '@clr/angular';

@Component({
  selector: 'app-ride-examples',
  templateUrl: './examples.component.html',
  imports: [ClrAccordionModule, ClrSidePanelModule, ClrAlertModule, ClrConditionalModule]
})
export class ExamplesComponent {
  readonly exampleRequested = output<string>();

  showExamples: boolean = false;
  isDevMode: boolean;

  constructor() {
    this.isDevMode = isDevMode();
  }

  show() {
    this.showExamples = true;
  }

  loadExample(example: string) {
    this.exampleRequested.emit(example);
    this.showExamples = false;
  }
}
