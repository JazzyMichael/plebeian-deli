import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { OrdersService } from '../../services/orders.service';
import { AuthService } from '../../services/auth.service';
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
      if (!user) {
        return;
      }

      this.buyerOrders$ = this.ordersService.getBuyerOrders(user.uid).pipe(
        map(orders => {
          return orders.map((o: any) => {
            return { ...o, thumb$: this.imgs.imageFromPath(o.thumbnailPath) }
          })
        })
      );
      this.isApprovedSeller = !!user.approvedSeller;
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
