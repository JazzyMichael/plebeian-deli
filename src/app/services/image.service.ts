import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private storage: AngularFireStorage) { }

  imageFromPath(path: string): Observable<any> {
    const ref = this.storage.ref(path);
    return ref.getDownloadURL();
  }
}
