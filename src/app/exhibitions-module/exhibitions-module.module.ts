import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExhibitionsComponent } from './exhibitions/exhibitions.component';

import { PdfViewerModule } from 'ng2-pdf-viewer';
import { MaterialModule } from '../material/material.module';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', component: ExhibitionsComponent }
];

@NgModule({
  declarations: [
    ExhibitionsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    PdfViewerModule
  ]
})
export class ExhibitionsModuleModule { }
