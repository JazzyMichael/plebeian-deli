import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private storage: AngularFireStorage) { }

  imageFromPath(path: string): Observable<any> {
    if (!path) return of('assets/icons/icon-192x192.png');
    const ref = this.storage.ref(path);
    return ref.getDownloadURL();
  }
}
