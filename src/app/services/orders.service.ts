import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(private afStore: AngularFirestore) { }


  // service orders

  watchServiceOrder(docId: string) {
    return this.afStore
      .collection('service-orders')
      .doc(docId)
      .valueChanges()
      .pipe(
        map(serviceOrder => {
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
