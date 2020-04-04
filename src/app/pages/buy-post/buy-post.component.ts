import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireFunctions } from '@angular/fire/functions';
import { AuthService } from '../../services/auth.service';
import { PostService } from '../../services/post.service';
import { switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { environment } from '../../../environments/environment';

declare var Stripe: any;
const stripe = Stripe(environment.stripe.key);

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
  checkoutErrorMsg: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService,
    private auth: AuthService,
    private funcs: AngularFireFunctions
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

  goToShipping() {
    this.purchaseComplete = false;
    this.checkoutFail = false;
  }

  async beginStripeCheckout() {
    const buyer = await this.auth.getCurrentUser();

    const order = {
      type: 'post',
      postId: this.post.postId,
      sellerStripeId: 'acct_1FDLnJImMAsZGgMt',
      sellerId: buyer.uid,
      buyerId: buyer.uid,
      buyerEmail: buyer.email || null,
      item: {
        name: this.post.title,
        description: this.post.description && this.post.description.length ? this.post.description : 'No description',
        amount: 1000,
        quantity: 1,
        thumbnailUrl: this.post.thumbnailImgUrl
      },
      category: this.post.category,
      thumbnailUrl: this.post.thumbnailImgUrl,
      thumbnailPath: this.post.thumbnailPath,
      subtotal: 1000,
      fee: 300,
      total: 1300,
      shipping: this.validShipping,
      status: 'placed',
      thankYouMessage: ''
    };

    console.log({ order });

    const session = await this.funcs
      .httpsCallable('createCheckoutSession')(order)
      .toPromise();

    console.log({ session });

    if (!session || !session.id) {
      this.checkoutFail = true;
      this.checkoutErrorMsg = 'Could not create checkout session...';
      return;
    }

    const checkoutResult = await stripe.redirectToCheckout({ sessionId: session.id });

    console.log({ checkoutResult });

    if (checkoutResult.error) {
      this.checkoutFail = true;
      this.checkoutErrorMsg = checkoutResult.error.message;
      return;
    }
  }

}
