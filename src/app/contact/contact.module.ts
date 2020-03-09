import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from '../material/material.module';
import { ContactFormComponent } from './contact-form/contact-form.component';
import { ContactMessagesComponent } from './contact-messages/contact-messages.component';

const routes: Routes = [
  { path: '', component: ContactFormComponent },
  { path: 'messages', component: ContactMessagesComponent }
];

@NgModule({
  declarations: [
    ContactFormComponent,
    ContactMessagesComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    MaterialModule
  ]
})
export class ContactModule { }
