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
  declarations: [DocsComponent],
  imports: [
    ClarityModule,
  ],
  exports: [DocsComponent]
})
export class DocsModule { }
