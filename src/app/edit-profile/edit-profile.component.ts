import { Component, OnInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../services/user.service';
import { CategoriesService } from '../services/categories.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit, AfterViewChecked {
  user$: Observable<any>;
  debounce: any;
  editingUsername: boolean;
  newUsername: string;
  categories: any[];
  uploading: string;

  constructor(
    private auth: AuthService,
    private snackbar: MatSnackBar,
    private userService: UserService,
    private catService: CategoriesService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.user$ = this.auth.user$.asObservable();
    this.categories = this.catService.getCategories();
  }

  ngAfterViewChecked(){
    this.cd.detectChanges();
  }

  updateField(uid: string, field: string, value: string) {
    if (this.debounce) {
      clearTimeout(this.debounce);
    }

    this.debounce = setTimeout(async () => {
      const obj = {};
      obj[field] = value;
      await this.userService.updateUserPromise(uid, obj);
      this.snackbar.open('Profile Updated!', '', { duration: 3000 });
      if (field === 'username') {
        this.newUsername = '';
      }
    }, 666);
  }

  onUpdateUsername(username: string) {
    this.newUsername = username;
  }

  async uploadProfilePic(uid: string, event: any) {
    const file = event.target.files[0];

    if (!file || !file.type || !file.type.split('/')[1]) {
      return alert('Thats a really weird file');
    }
    if (file.type.split('/')[0] !== 'image') {
      return alert('Only Images are allowed for profile pics');
    }

    this.uploading = 'profile-picture';

    await this.userService.updateUserProfilePic(uid, file);

    this.snackbar.open('Profile Pic Updated!', '', { duration: 3000 });

    this.uploading = null;
  }

  async uploadBackgroundPic(uid: string, event: any) {
    const file = event.target.files[0];

    if (!file || !file.type || !file.type.split('/')[1]) {
      return alert('Thats a really weird file');
    }
    if (file.type.split('/')[0] !== 'image') {
      return alert('Only Images are allowed for background pics');
    }

    this.uploading = 'background';

    await this.userService.updateUserBackgroundPic(uid, file);

    this.snackbar.open('Background Pic Updated!', '', { duration: 3000 });

    this.uploading = null;
  }

  async uploadCV(uid: string, event: any) {
    const file = event.target.files[0];

    if (!file || !file.type || !file.type.split('/')[1]) {
      return alert('Thats a really weird file');
    }
    if (file.type.split('/')[0] !== 'application') {
      return alert('Only PDFs are allowed for CVs');
    }

    this.uploading = 'cv';

    await this.userService.updateUserCV(uid, file);

    this.snackbar.open('CV Updated!', '', { duration: 3000 });

    this.uploading = null;
  }
}
