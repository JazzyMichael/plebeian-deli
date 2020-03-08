import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { PostService } from '../services/post.service';
import { OrdersService } from '../services/orders.service';
import { switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-buy-post',
  templateUrl: './buy-post.component.html',
  styleUrls: ['./buy-post.component.scss']
})
export class BuyPostComponent implements OnInit {

  post: any;
  sellerStripeId: string;
  validShipping: any;
  purchaseComplete: boolean;
  checkoutFail: boolean;

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

    this.route.queryParamMap.subscribe(params => {
      this.checkoutFail = !!params.get('cancelled');
      this.purchaseComplete = !!params.get('success');
    });

    this.route.paramMap.pipe(
      switchMap(params => of(params.get('id'))),
      switchMap(postId => this.postService.getPost(postId))
    ).subscribe(async post => {
      if (!post) return this.router.navigateByUrl('/deli');
      this.post = post;
    });
  }

  addressValidityChange(validForm: any) {
    this.validShipping = validForm;
  }

  async beginStripeCheckout() {
    const buyer = await this.auth.getCurrentUser();

    const order = {
      type: 'post',
      postId: this.post.postId,
      sellerStripeId: '',
      sellerId: this.post.userId,
      buyerId: buyer.uid,
      item: {
        name: this.post.title,
        description: this.post.description,
        amount: 3,
        quantity: 1,
        thumbnailUrl: this.post.thumbnailImgUrl
      },
      category: this.post.category,
      thumbnailPath: this.post.thumbnailPath,
      createdTimestamp: new Date(),
      price: 1,
      quantity: 1,
      subtotal: 1,
      fee: 1,
      total: 2,
      shipping: this.validShipping,
      status: 'pending'
    };

    await this.ordersService.placeOrder(order);

    this.purchaseComplete = true;
  }

}
