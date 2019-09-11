import { Component, OnInit, Input } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { OrdersService } from 'src/app/services/orders.service';

@Component({
  selector: 'app-bought-services',
  templateUrl: './bought-services.component.html',
  styleUrls: ['./bought-services.component.scss']
})
export class BoughtServicesComponent implements OnInit {

  @Input() user: any;

  viewingService: any;
  viewingServiceSub: Subscription;
  newMessageText: string;

  serviceOrders$: Observable<any>;

  constructor(private ordersService: OrdersService) { }

  ngOnInit() {
    this.serviceOrders$ = this.ordersService
      .getServiceOrdersForBuyer(this.user.uid);
  }

  viewService(service: any) {
    this.viewingService = service;

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

  purchaseService() {
    const id = this.viewingService.serviceOrderId;

    const newMessage = {
      text: `The service has been purchased by the buyer for $${this.viewingService.price}.`,
      uid: this.user.uid,
      timestamp: new Date()
    };

    const updateObj = {
      purchased: true,
      purchasedTimestamp: new Date(),
      purchasedPrice: parseInt(this.viewingService.price),
      messages: [ ...this.viewingService.messages, newMessage ]
    };

    this.ordersService.updateServiceOrder(id, updateObj);

    this.viewingService.purchased = updateObj.purchased;
    this.viewingService.purchasedTimestamp = updateObj.purchasedTimestamp;
    this.viewingService.purchasedPrice = updateObj.purchasedPrice;
  }

}
