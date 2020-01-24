import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { Routes, RouterModule } from '@angular/router';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MembersComponent } from './members/members.component';

const routes: Routes = [
  { path: '', component: MembersComponent }
];

@NgModule({
  declarations: [
    MembersComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    InfiniteScrollModule
  ]
})
export class MembersModuleModule { }
