import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material';
import { UserService } from '../services/user.service';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  user$: Observable<any>;

  debounce: any;

  editingUsername: boolean;

  newUsername: string;

  constructor(
    private auth: AuthService,
    private snackbar: MatSnackBar,
    private userService: UserService,
    private storage: AngularFireStorage
  ) { }

  ngOnInit() {
    this.user$ = this.auth.user$.asObservable();
  }

  updateField(uid: string, field: string, value: string) {
    if (this.debounce) {
      clearTimeout(this.debounce);
    }

    this.debounce = setTimeout(async () => {
      const obj = {};
      obj[field] = value;
      await this.userService.updateUserPromise(uid, obj);
      this.snackbar.open('Profile Updated!', 'Ok', { duration: 3000 });
      if (field === 'username') {
        this.newUsername = '';
      }
    }, 666);
  }

  onUpdateUsername(username: string) {
    this.newUsername = username;
  }

  async uploadProfilePic(uid, event: any) {
    return;
    const file = event.target.files[0];

    if (file.type.split('/')[0] !== 'image') {
      console.log('Only Images are allowed for profile picture');
      return;
    }

    if (!uid || !file.type.split('/')[1]) {
      console.log('NO UID or file type');
      return;
    }

    console.log('file type: ', file.type);

    const fileType = file.type.split('/')[1];

    const path = `profile-pictures/${uid}.${fileType}`;

    const ref = this.storage.ref(path);

    await ref.put(file, { customMetadata: { uid } });

    const url = await ref.getDownloadURL().toPromise();

    await this.userService.updateUserPromise(uid, { profileUrl: url, profileType: fileType });
  }

  async uploadBackgroundPic(uid: string, event: any) {
    return;
    const file = event.target.files[0];

    if (file.type.split('/')[0] !== 'image') {
      console.log('images only bro');
      return;
    }

    if (!uid || !file.type.split('/')[1]) {
      console.log('NO UID or file type');
      return;
    }

    const fileType = file.type.split('/')[1];

    const path = `profile-backgrounds/${uid}.${fileType}`;

    const ref = this.storage.ref(path);

    await ref.put(file);

    ref.getDownloadURL().subscribe(async url => {
      await this.userService.updateUserPromise(uid, { backgroundUrl: url, backgroundType: fileType });
    });

    // console.log('ref', ref);

    // try {
    //   await ref.put(file);
    // } catch (e) {
    //   console.log('catch', e);
    //   this.storage.upload(path, file);
    // }

    // await ref.put(file);

    // const url = await ref.getDownloadURL().toPromise();

    // await this.userService.updateUserPromise(uid, { backgroundUrl: url, backgroundType: fileType });
  }

}
