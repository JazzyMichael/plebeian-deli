import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { HomeComponent } from './home/home.component';
import { MoreComponent } from './more/more.component';

@NgModule({
  declarations: [
    AdminComponent,
    HomeComponent,
    MoreComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MaterialModule
  ],
  exports: [
    MaterialModule
  ]
})
export class AdminModule { }
