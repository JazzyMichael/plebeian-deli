import { Component, OnInit } from '@angular/core';
import { OrdersService } from 'src/app/services/orders.service';
import { ImageService } from 'src/app/services/image.service';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {

  order: any;
  user$: Observable<any>;

  constructor(
    private ordersService: OrdersService,
    private auth: AuthService,
    private imgs: ImageService
  ) { }

  ngOnInit() {
    this.user$ = this.auth.user$.asObservable();
    this.order = this.ordersService.getSelectedOrder();
    console.log(this.order);
  }

  getThumbnail(path: string): Observable<any> {
    return this.imgs.imageFromPath(path)
  }

  async acceptOrder() {
    await this.ordersService.acceptOrder(this.order.id);
  }

}
