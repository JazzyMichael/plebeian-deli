import { Component, OnInit, Input } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { OrdersService } from 'src/app/services/orders.service';

@Component({
  selector: 'app-sold-services',
  templateUrl: './sold-services.component.html',
  styleUrls: ['./sold-services.component.scss']
})
export class SoldServicesComponent implements OnInit {

  @Input() user: any;

  viewingService: any;
  viewingServiceSub: Subscription;
  newMessageText: string;
  newServicePrice: string = '';
  validatePrice$: Subject<any> = new Subject();

  serviceOrders$;

  constructor(
    private ordersService: OrdersService
  ) { }

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

  viewService(service: any) {
    this.viewingService = service;
    this.newServicePrice = this.viewingService.price ? `${this.viewingService.price}` : '';
    this.viewingServiceSub = this.ordersService
      .watchServiceOrder(service.serviceOrderId)
      .subscribe(s => this.viewingService = s);
  }

  stopViewingService() {
    this.viewingService = null;

    if (this.viewingServiceSub) {
      this.viewingServiceSub.unsubscribe();
    }
  }

  sendMessage() {
    const id = this.viewingService.serviceOrderId;

    const message = {
      text: this.newMessageText,
      uid: this.user.uid,
      timestamp: new Date()
    };

    const updateObj = {
      messages: [ ...this.viewingService.messages, message ]
    };

    this.ordersService.updateServiceOrder(id, updateObj);

    this.newMessageText = '';
  }

  acceptService() {
    const id = this.viewingService.serviceOrderId;

    const newMessage = {
      text: `The service requirements have been approved by the seller at a price of $${this.newServicePrice}.`,
      uid: this.user.uid,
      timestamp: new Date()
    };

    const updateObj = {
      accepted: true,
      acceptedTimestamp: new Date(),
      price: parseInt(this.newServicePrice),
      messages: [ ...this.viewingService.messages, newMessage ]
    };

    this.ordersService.updateServiceOrder(id, updateObj);

    this.viewingService.accepted = updateObj.accepted;
    this.viewingService.acceptedTimestamp = updateObj.acceptedTimestamp;
    this.viewingService.price = updateObj.price;

    this.newServicePrice = '';
  }

  shipService() {
    const id = this.viewingService.serviceOrderId;

    const newMessage = {
      text: 'The service has been finished and shipped by the seller.',
      uid: this.user.uid,
      timestamp: new Date()
    };

    const updateObj = {
      shipped: true,
      shippedTimestamp: new Date(),
      messages: [ ...this.viewingService.messages, newMessage ]
    };

    this.ordersService.updateServiceOrder(id, updateObj);

    this.viewingService.shipped = updateObj.shipped;
    this.viewingService.shippedTimestamp = updateObj.shippedTimestamp;
  }

}
