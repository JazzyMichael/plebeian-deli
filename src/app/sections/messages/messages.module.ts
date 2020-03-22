import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material/material.module';
import { Routes, RouterModule } from '@angular/router';
import { MessagesComponent } from './messages.component';
import { MessageHeaderComponent } from './message-header/message-header.component';
import { MessageListComponent } from './message-list/message-list.component';
import { MessageViewComponent } from './message-view/message-view.component';
import { MessageFormComponent } from './message-form/message-form.component';

const routes: Routes = [
  {
    path: '',
    component: MessagesComponent,
    children: [
      { path: 'list', component: MessageListComponent },
      { path: 'new/:id/:username', component: MessageFormComponent },
      { path: 'new', redirectTo: 'list' },
      { path: ':id', component: MessageViewComponent },
      { path: '**', redirectTo: '/messages/list' }
    ]
  }
];

@NgModule({
  declarations: [
    MessagesComponent,
    MessageHeaderComponent,
    MessageListComponent,
    MessageViewComponent,
    MessageFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule.forChild(routes)
  ]
})
export class MessagesModule { }
