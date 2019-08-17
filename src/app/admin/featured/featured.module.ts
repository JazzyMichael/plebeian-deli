import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FeaturedComponent } from './featured.component';

const routes: Routes = [
  { path: '', component: FeaturedComponent }
];

@NgModule({
  declarations: [FeaturedComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class FeaturedModule { }
