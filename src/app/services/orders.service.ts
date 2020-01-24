import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  sampleOrders: any[] = [
    { title: 'Banana Pudding', status: 'pending', timestamp: '1 min ago', image: 'assets/images/calendar-250.png', id: '111aaa' },
    { title: 'sQuash', status: 'accepted', timestamp: '6 min ago', image: 'assets/images/tv-250.png', id: '222bbb' },
    { title: 'Chimpanzee Dance Squad', status: 'in-progress', timestamp: '10 days ago', image: 'assets/images/calendar-250.png', id: '333ccc' },
    { title: 'Spanish Lilys on a Summer Morning', status: 'fullfilled', timestamp: '1 month ago', image: 'assets/images/ham-250.png', id: '444ddd' }
  ];

  selectedOrder: any;

  constructor(private afStore: AngularFirestore, private router: Router) { }

  getSampleOrders(): Observable<any[]> {
    return of(this.sampleOrders);
  }

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

  // service orders

  watchServiceOrder(docId: string) {
    return this.afStore
      .collection('service-orders')
      .doc(docId)
      .valueChanges()
      .pipe(
        map((serviceOrder: any) => {
          return { ...serviceOrder, serviceOrderId: docId };
        })
      );
  }

  getServiceOrdersForSeller(sellerId: string) {
    return this.afStore
      .collection('service-orders', ref => ref.where('sellerId', '==', sellerId).orderBy('inquiredTimestamp', 'desc'))
      .valueChanges({ idField: 'serviceOrderId' });
  }

  getServiceOrdersForBuyer(buyerId: string) {
    return this.afStore
      .collection('service-orders', ref => ref.where('buyerId', '==', buyerId).orderBy('inquiredTimestamp', 'desc'))
      .valueChanges({ idField: 'serviceOrderId' });
  }

  placeServiceOrder(obj: any) {
    this.afStore
      .collection('service-orders')
      .add(obj)
      .then(() => console.log('service order placed successfully'))
      .catch(e => console.log('error placing service order', e));
  }

  updateServiceOrder(uid: string, obj: any) {
    this.afStore
      .collection('service-orders')
      .doc(uid)
      .update(obj)
      .then(() => console.log('service order updated successfully'))
      .catch(e => console.log('error updating service order', e));
  }


  // deli orders

  getDeliOrdersForSeller(sellerId: string) {
    return this.afStore
      .collection('deli-orders', ref => ref.where('sellerId', '==', sellerId).orderBy('purchasedTimestamp', 'desc'))
      .valueChanges({ idField: 'deliOrderId' });
  }

  getDeliOrdersForBuyer(buyerId: string) {
    return this.afStore
      .collection('deli-orders', ref => ref.where('buyerId', '==', buyerId).orderBy('purchasedTimestamp', 'desc'))
      .valueChanges({ idField: 'deliOrderId' });
  }

  placeDeliOrder(obj: any) {
    this.afStore
      .collection('deli-orders')
      .add(obj)
      .then(() => console.log('deli order placed successfully'))
      .catch(e => console.log('error placing deli order', e));
  }

  updateDeliOrder(uid: string, obj: any) {
    this.afStore
      .collection('deli-orders')
      .doc(uid)
      .update(obj)
      .then(() => console.log('deli order updated successfully'))
      .catch(e => console.log('error updating deli order', e));
  }


  // shop orders

  getShopOrdersForSeller(sellerId: string) {
    return this.afStore
      .collection('shop-orders', ref => ref.where('sellerId', '==', sellerId).orderBy('purchasedTimestamp', 'desc'))
      .valueChanges({ idField: 'shopOrderId' });
  }

  getShopOrdersForBuyer(buyerId: string) {
    return this.afStore
      .collection('shop-orders', ref => ref.where('buyerId', '==', buyerId).orderBy('purchasedTimestamp', 'desc'))
      .valueChanges({ idField: 'shopOrderId' });
  }

  placeShopOrder(obj: any) {
    this.afStore
      .collection('shop-orders')
      .add(obj)
      .then(() => console.log('shop order placed successfully'))
      .catch(e => console.log('error placing shop order', e));
  }

  updateShopOrder(uid: string, obj: any) {
    this.afStore
      .collection('shop-orders')
      .doc(uid)
      .update(obj)
      .then(() => console.log('shop order updated successfully'))
      .catch(e => console.log('error updating shop order', e));
  }
}
