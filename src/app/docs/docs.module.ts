import { NgModule } from '@angular/core';

import { ClarityModule } from '@clr/angular';

import { DocsComponent } from './docs.component';

import {
  ClarityIcons,
  downloadCloudIcon,
  libraryIcon,
  uploadCloudIcon
} from '@cds/core/icon';

ClarityIcons.addIcons(downloadCloudIcon, libraryIcon, uploadCloudIcon);

@NgModule({
    imports: [
        ClarityModule,
        DocsComponent,
    ],
    exports: [DocsComponent]
})
export class DocsModule { }
