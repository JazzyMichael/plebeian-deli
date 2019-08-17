import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewPostComponent } from './new-post.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', component: NewPostComponent }
];

@NgModule({
  declarations: [NewPostComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class NewPostModule { }
