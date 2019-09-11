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
  dataSource = ELEMENT_DATA;
  columnsToDisplay = ['name', 'weight', 'symbol', 'position'];
  expandedElement: PeriodicElement | null;

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
    this.authService.user$.asObservable().subscribe(user => {
      if (user && user.uid) {
        this.user = user;
        // this.placedServices$ = this.ordersService.getServiceOrdersForBuyer(user.uid);
        // if (user.approvedSeller) {
        //   this.serviceOrders$ = this.ordersService.getServiceOrdersForSeller(user.uid);
        // }
      } else {
        this.user = null;
      }
    });
  }
}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
  description: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    position: 1,
    name: 'Hydrogen',
    weight: 1.0079,
    symbol: 'H',
    description: `Hydrogen is a chemical element with symbol H and atomic number 1. With a standard
        atomic weight of 1.008, hydrogen is the lightest element on the periodic table.`
  }, {
    position: 2,
    name: 'Helium',
    weight: 4.0026,
    symbol: 'He',
    description: `Helium is a chemical element with symbol He and atomic number 2. It is a
        colorless, odorless, tasteless, non-toxic, inert, monatomic gas, the first in the noble gas
        group in the periodic table. Its boiling point is the lowest among all the elements.`
  }, {
    position: 3,
    name: 'Lithium',
    weight: 6.941,
    symbol: 'Li',
    description: `Lithium is a chemical element with symbol Li and atomic number 3. It is a soft,
        silvery-white alkali metal. Under standard conditions, it is the lightest metal and the
        lightest solid element.`
  }
];
