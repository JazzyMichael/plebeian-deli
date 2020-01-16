import { Component, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Observable, Subject, Subscription } from 'rxjs';
import { OrdersService } from '../services/orders.service';
import { AuthService } from '../services/auth.service';
import { tap, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class OrdersComponent implements OnInit {

  user: any;
  placedServices$: Observable<any>;
  serviceOrders$: Observable<any>;

  viewingService: any;
  viewingServiceSub: Subscription;
  newMessageText: string;
  newServicePrice: string = '';
  validatePrice$: Subject<any> = new Subject();

  constructor(
    private authService: AuthService,
    private ordersService: OrdersService
  ) { }

  ngOnInit() {
    // this.authService.user$.asObservable().subscribe(user => {
    //   if (user && user.uid) {
    //     this.user = user;
    //     // this.placedServices$ = this.ordersService.getServiceOrdersForBuyer(user.uid);
    //     // if (user.approvedSeller) {
    //     //   this.serviceOrders$ = this.ordersService.getServiceOrdersForSeller(user.uid);
    //     // }
    //   } else {
    //     this.user = null;
    //   }
    // });
  }
}
