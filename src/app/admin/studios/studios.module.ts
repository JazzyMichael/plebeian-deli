import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudiosComponent } from './studios.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', component: StudiosComponent }
];

@NgModule({
  declarations: [StudiosComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class StudiosModule { }
