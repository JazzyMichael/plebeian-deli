import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  editingService: any;
  // services$: BehaviorSubject<any> = new BehaviorSubject([]);

  constructor(private afStore: AngularFirestore) {
    // this.afStore
    //   .collection('services')
    //   .valueChanges({ idField: 'serviceId' })
    //   .subscribe(services => {
    //     this.services$.next(services);
    //   });
  }

  getUserServices(uid: string) {
    return this.afStore
      .collection('services', ref => ref.where('userId', '==', uid))
      .valueChanges({ idField: 'serviceId' });
  }

  addService(serviceObj: any) {
    return this.afStore
      .collection('services')
      .add(serviceObj)
      .then(() => console.log('service added'))
      .catch(e => console.log('error adding service', e));
  }

  updateService(docId: string, serviceObj: any) {
    return this.afStore
      .collection('services')
      .doc(docId)
      .update(serviceObj)
      .then(() => console.log('service updated'))
      .catch(e => console.log('error updating service', e));
  }

  deleteService(docId: string) {
    return this.afStore
      .collection('services')
      .doc(docId)
      .delete()
      .then(() => console.log('service deleted'))
      .catch(e => console.log('error deleting service', e));
  }
}
