import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../services/post.service';
import { tap } from 'rxjs/operators';
import { AngularFireFunctions } from '@angular/fire/functions';

declare var Stripe: any;

// prod
const stripe = Stripe('pk_live_9RFFwjYhsrCgEbkm3DBpyOv8');
// test
// const stripe = Stripe('pk_test_vWeiNQrgSgiNW9fBO2IX0EUT');
const elements = stripe.elements();

const card = elements.create('card');

@Component({
  selector: 'app-buy-post',
  templateUrl: './buy-post.component.html',
  styleUrls: ['./buy-post.component.scss']
})
export class BuyPostComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('cardForm', { static: false }) cardForm: ElementRef;

  mounted: boolean;

  loading: boolean;

  post$: any;

  price: number;

  sellerStripeId: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService,
    private fun: AngularFireFunctions
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(async params => {

      const postId = params.get('id');

      if (!postId) {
        return this.router.navigateByUrl('/deli');
      }

      document.querySelector('.mat-drawer-content').scrollTop = 0;

      document.querySelector('.mat-sidenav-content').scrollTop = 0;

      this.post$ = this.postService.getPost(postId)
        .pipe(
          tap(post => {
            if (!post) {
              return this.router.navigateByUrl('/deli');
            }

            if (!post.quantity) {
              return window.alert('This art just sold out!');
            }

            this.price = post && post.price ? post.price / 0.9721 : null;

            this.sellerStripeId = post && post.stripeConnectData && post.stripeConnectData.stripe_user_id ? 
              post.stripeConnectData.stripe_user_id :
              null;

            if (!this.mounted) {
              setTimeout(() => {
                card.mount(this.cardForm.nativeElement);
                this.mounted = true;
              }, 333);
            }
          })
        );
    });
  }

  ngAfterViewInit() {
    // card.mount(this.cardForm.nativeElement);
  }

  ngOnDestroy() {
    try {
      card.unmount(this.cardForm.nativeElement);
    } catch (e) {
      console.log('unmount', e);
    }
  }

  async handleForm(e: any) {
    e.preventDefault();

    const { token, error } = await stripe.createToken(card);

    if (error || !this.price || !this.sellerStripeId) {
      console.log('error', error);
      const errorElement = document.getElementById('card-errors');
      errorElement.textContent = JSON.stringify(error);
    } else {
      this.loading = true;

      const res = await this.fun
        .httpsCallable('createConnectCharge')({
          source: token.id,
          sellerAccountId: this.sellerStripeId,
          price: this.price,
          orderType: 'post'
        })
        .toPromise();

      this.loading = false;
    }
  }

}
