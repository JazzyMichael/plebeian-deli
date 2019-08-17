import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExhibitionsRoutingModule } from './exhibitions-routing.module';
import { ExhibitionsComponent } from './exhibitions.component';

@NgModule({
  declarations: [ExhibitionsComponent],
  imports: [
    CommonModule,
    ExhibitionsRoutingModule
  ]
})
export class ExhibitionsModule { }
