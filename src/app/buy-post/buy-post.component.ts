import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { PostService } from '../services/post.service';
import { OrdersService } from '../services/orders.service';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-buy-post',
  templateUrl: './buy-post.component.html',
  styleUrls: ['./buy-post.component.scss']
})
export class BuyPostComponent implements OnInit {

  post: any;
  sellerStripeId: string;
  addressComplete: boolean;
  purchaseComplete: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService,
    private ordersService: OrdersService,
    private auth: AuthService
  ) { }

  ngOnInit() {
    document.querySelector('.mat-drawer-content').scrollTop = 0;
    document.querySelector('.mat-sidenav-content').scrollTop = 0;

    this.route.paramMap.pipe(
      switchMap(params => of(params.get('id'))),
      switchMap(postId => this.postService.getPost(postId))
    ).subscribe(async post => {
      if (!post) {
        return this.router.navigateByUrl('/deli');
      }
      this.post = post;
    });
  }

  addressValidityChange(isValid: boolean = false) {
    this.addressComplete = isValid;
  }

  async beginStripeCheckout() {
    const buyer = await this.auth.getCurrentUser();

    const order = {
      type: 'post',
      postId: this.post.postId,
      item: this.post.title,
      category: this.post.category,
      thumbnailUrl: this.post.thumbnailImgUrl,
      thumbnailPath: this.post.thumbnailPath,
      sellerId: this.post.userId,
      buyerId: buyer.uid,
      createdTimestamp: new Date(),
      price: 1,
      quantity: 1,
      subtotal: 1,
      fee: 1,
      total: 2,
      shipping: {},
      status: 'pending'
    };

    await this.ordersService.placeOrder(order);

    this.purchaseComplete = true;
  }

}
