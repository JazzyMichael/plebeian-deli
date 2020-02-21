import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  selectedOrder: any;

  constructor(private afStore: AngularFirestore, private router: Router) { }

  selectOrder(order: any) {
    this.selectedOrder = order;

    if (this.selectedOrder) {
      this.router.navigateByUrl('/orders/details');
    }
  }

  getSelectedOrder() {
    if (!this.selectedOrder) {
      this.router.navigateByUrl('/orders');
    }

    return this.selectedOrder;
  }

  placeOrder(order: any) {
    return this.afStore.collection('orders').add(order);
  }

  getBuyerOrders(buyerId: string) {
    return this.afStore
      .collection('orders', ref => ref.where('buyerId', '==', buyerId))
      .valueChanges({ idField: 'id' });
  }

  getSellerOrders(sellerId: string) {
    return this.afStore
      .collection('orders', ref => ref.where('sellerId', '==', sellerId))
      .valueChanges({ idField: 'id' });
  }

}
