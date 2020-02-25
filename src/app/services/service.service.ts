import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  editingService: any;

  constructor(private afStore: AngularFirestore) { }

  getUserServices(uid: string) {
    return this.afStore
      .collection('services', ref => ref.where('userId', '==', uid))
      .valueChanges({ idField: 'serviceId' });
  }

  getService(docId: string) {
    return this.afStore
      .collection('services')
      .doc(docId)
      .get();
  }

  addService(serviceObj: any) {
    return this.afStore
      .collection('services')
      .add(serviceObj)
      .catch(e => console.log('error adding service', e));
  }

  updateService(docId: string, serviceObj: any) {
    return this.afStore
      .collection('services')
      .doc(docId)
      .update(serviceObj)
      .catch(e => console.log('error updating service', e));
  }

  deleteService(docId: string) {
    return this.afStore
      .collection('services')
      .doc(docId)
      .delete()
      .catch(e => console.log('error deleting service', e));
  }
}
