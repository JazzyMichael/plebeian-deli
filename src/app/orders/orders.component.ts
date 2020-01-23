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

  orders: any[];

  constructor(
    private authService: AuthService,
    private ordersService: OrdersService
  ) { }

  ngOnInit() {
    this.orders = [
      { title: 'Tightel', status: 'ACCEPTED', timestamp: '6 min ago', image: 'assets/images/ham-250.png' },
      { title: 'sQuash', status: 'IN PROGRESS', timestamp: '10 days ago', image: 'assets/images/tv-250.png' },
      { title: 'Chimpanzee Dance Squad', status: 'FULLFILLED', timestamp: '1 month ago', image: 'assets/images/calendar-250.png' },
      { title: 'Spanish Lilys on a Summer Morning', status: 'FULLFILLED', timestamp: '1 month ago', image: 'assets/images/ham-250.png' }
    ];
  }
}
