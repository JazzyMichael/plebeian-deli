import { Component, OnInit } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { OrdersService } from '../../services/orders.service';
import { AuthService } from '../../services/auth.service';
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

  /*
    ngOnInit() {

    this.serviceOrders$ = this.ordersService
      .getServiceOrdersForSeller(this.user.uid);

    this.validatePrice$
      .pipe(debounceTime(777))
      .subscribe(() => {
        if (this.newServicePrice) {
          let chars = this.newServicePrice.split('');

          chars = chars.filter(c => {
            if (
              c === '1' ||
              c === '2' ||
              c === '3' ||
              c === '4' ||
              c === '5' ||
              c === '6' ||
              c === '7' ||
              c === '8' ||
              c === '9' ||
              c === '0'
            ) {
              return true;
            } else {
              return false;
            }
          });

          this.newServicePrice = chars.join('');
        }
      });
  }

  priceInput() {
    this.validatePrice$.next();
  }
  */
}
