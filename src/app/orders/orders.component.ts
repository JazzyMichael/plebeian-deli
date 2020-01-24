import { Component, OnInit } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { OrdersService } from '../services/orders.service';
import { AuthService } from '../services/auth.service';
import { tap, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  orders: Observable<any[]>;

  constructor(
    private authService: AuthService,
    private ordersService: OrdersService
  ) {
    this.orders = this.ordersService.getSampleOrders();
  }

  ngOnInit() {
  }

  selectOrder(order: any) {
    this.ordersService.selectOrder(order);
  }
}
