import { Component, OnInit } from '@angular/core';
import { OrdersService } from 'src/app/services/orders.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {

  order: any;

  constructor(private ordersService: OrdersService) { }

  ngOnInit() {
    this.order = this.ordersService.getSelectedOrder();
  }

}
