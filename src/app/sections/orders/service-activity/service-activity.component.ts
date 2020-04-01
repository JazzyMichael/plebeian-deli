import { Component, OnInit, Input } from '@angular/core';
import { OrdersService } from 'src/app/services/orders.service';

@Component({
  selector: 'app-service-activity',
  templateUrl: './service-activity.component.html',
  styleUrls: ['./service-activity.component.scss']
})
export class ServiceActivityComponent implements OnInit {
  @Input() order: any;

  ratings: number[] = [1, 2, 3, 4, 5];
  rating: number;

  constructor(
    private ordersService: OrdersService
  ) { }

  ngOnInit(): void {
  }

  acceptOrder() {
    this.order.status = 'accepted';
  }

  cancelOrder() {
    this.order.status = 'cancelled';
  }

  checkout() {
    this.order.status = 'paid';
  }

  shipOrder() {
    this.order.status = 'shipped';
  }

  rateOrder(rating: number) {
    this.order.rating = rating;
  }

}
