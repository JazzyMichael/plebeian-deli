import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { PromoCodesComponent } from './promo-codes.component';

const routes: Routes = [
  { path: '', component: PromoCodesComponent }
];

@NgModule({
  declarations: [PromoCodesComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class PromoCodesModule { }
