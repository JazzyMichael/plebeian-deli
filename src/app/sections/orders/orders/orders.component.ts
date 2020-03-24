import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { OrdersService } from '../../../services/orders.service';
import { AuthService } from '../../../services/auth.service';
import { tap, map } from 'rxjs/operators';
import { ImageService } from 'src/app/services/image.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit, OnDestroy {

  buyerOrders$: Observable<any[]>;
  sellerOrders$: Observable<any[]>;

  userSub: Subscription;
  isApprovedSeller: boolean;

  constructor(
    private authService: AuthService,
    private ordersService: OrdersService,
    private imgs: ImageService
  ) {}

  ngOnInit() {
    this.userSub = this.authService.user$.subscribe(user => {
      if (!user) return;

      this.buyerOrders$ = this.ordersService.getBuyerOrders(user.uid).pipe(
        map(orders => {
          return orders.map((o: any) => {
            return { ...o, thumb$: this.imgs.imageFromPath(o.thumbnailPath) }
          })
        })
      );

      this.isApprovedSeller = !!user.approvedSeller || true;
      if (this.isApprovedSeller) {
        this.sellerOrders$ = this.ordersService.getSellerOrders(user.uid).pipe(
          map(orders => {
            return orders.map((o: any) => {
              return { ...o, thumb$: this.imgs.imageFromPath(o.thumbnailPath) }
            })
          })
        );
      }

    });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  selectOrder(order: any, isBuyer: boolean) {
    this.ordersService.selectOrder({ ...order, isBuyer});
  }

}
