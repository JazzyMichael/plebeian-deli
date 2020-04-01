import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material/material.module';
import { Routes, RouterModule } from '@angular/router';
import { OrdersComponent } from './orders/orders.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { ServiceCardComponent } from './service-card/service-card.component';
import { PostCardComponent } from './post-card/post-card.component';
import { PostActivityComponent } from './post-activity/post-activity.component';
import { ServiceActivityComponent } from './service-activity/service-activity.component';

const routes: Routes = [
  { path: '', component: OrdersComponent },
  { path: 'details', component: OrderDetailsComponent }
];

@NgModule({
  declarations: [
    OrdersComponent,
    OrderDetailsComponent,
    ServiceCardComponent,
    PostCardComponent,
    PostActivityComponent,
    ServiceActivityComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ]
})
export class OrdersModule { }
