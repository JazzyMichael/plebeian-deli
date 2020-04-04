import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ServiceService } from '../../services/service.service';
import { AuthService } from '../../services/auth.service';
import { OrdersService } from '../../services/orders.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-inquire-service',
  templateUrl: './inquire-service.component.html',
  styleUrls: ['./inquire-service.component.scss']
})
export class InquireServiceComponent implements OnInit {
  user: any;
  service: any;
  images: any[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private services: ServiceService,
    private orders: OrdersService,
    private auth: AuthService,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(async params => {
      const id = params.get('id');

      if (!id) {
        return this.router.navigateByUrl('/deli');
      }

      document.querySelector('.mat-drawer-content').scrollTop = 0;
      document.querySelector('.mat-sidenav-content').scrollTop = 0;

      const doc = await this.services.getService(id).toPromise();

      if (doc && doc.exists) {
        this.service = doc.data();
        console.log(this.service);
      } else {
        return this.router.navigateByUrl('/deli');
      }
    })
  }

  addImage(event: any) {
    const file = event.target.files[0];

    if (file.type.split('/')[0] !== 'image') {
      return alert('Only Images Plz');
    }

    const reader = new FileReader();

    reader.onload = (e: any) => {
      this.images.push({ file, url: e.target.result });
    }

    reader.readAsDataURL(file);
  }

  removeImage(index: number) {
    this.images.splice(index, 1);
  }

  async submit() {
    const buyer = await this.auth.getCurrentUser();

    const order = {
      type: 'service',
      buyerId: buyer.uid,
      buyerEmail: buyer.email,
      sellerId: buyer.uid,
      sellerStripeId: 'acct_1FDLnJImMAsZGgMt',

      item: {
        name: this.service.title,
        description: this.service.description || 'description',
        amount: 1000,
        quantity: 1,
        thumbnailUrl: ''
      },

      fee: 100,
      subtotal: 1000,
      total: 1400,

      thumbnailUrl: '',
      thumbnailPath: '',
      status: 'placed',
      thankYouMessage: '',
      timestamp: new Date()
    };

    const res = await this.orders.placeOrder(order);

    console.log(res);

    this.snackbar.open('Your inquiry has been sent to the artist!', '', { duration: 4444 })

    await this.router.navigateByUrl('/orders');
  }

}
