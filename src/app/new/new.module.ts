import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';

import { NewComponent } from './new.component';
import { NewHeaderComponent } from './new-header/new-header.component';
import { PostFormComponent } from './post-form/post-form.component';
import { ServiceFormComponent } from './service-form/service-form.component';
import { EventFormComponent } from './event-form/event-form.component';

const routes: Routes = [
  {
    path: '',
    component: NewComponent,
    children: [
      { path: 'post', component: PostFormComponent },
      { path: 'service', component: ServiceFormComponent },
      { path: 'event', component: EventFormComponent },
      { path: '**', redirectTo: '/new/post' }
    ]
  }
];

@NgModule({
  declarations: [
    NewComponent,
    NewHeaderComponent,
    PostFormComponent,
    ServiceFormComponent,
    EventFormComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ]
})
export class NewModule { }
