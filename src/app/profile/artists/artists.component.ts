import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Observable, forkJoin } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-artists',
  templateUrl: './artists.component.html',
  styleUrls: ['./artists.component.scss']
})
export class ArtistsComponent implements OnInit, OnChanges {
  @Input() user: any;
  @Input() editable: boolean;

  editing: boolean;
  artists$: Observable<any>;
  artists: any[];
  selectedArtistIds: any[];

  constructor(private userService: UserService) {
    this.artists$ = this.userService.getArtists()
      .pipe(tap(artists => this.artists = artists));
  }

  ngOnInit() {
    this.selectedArtistIds = [];
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes.user.currentValue) {
      // join ids to users

      const artistIds = changes.user.currentValue.artists;
      const promises = [];

      for (const id of artistIds) {
        promises.push(this.userService.getUserById(id));
      }

      const users = await Promise.all(promises);

      this.user.artists = users;
      this.selectedArtistIds = users.map(a => a.uid);
      console.log('BOOM', users);
    }
  }

  startEditing() {
    // load all artists
    this.artists$ = this.userService.getArtists()
      .pipe(tap(artists => {
        // this.artists = artists;
        // this.user.artists.forEach(artist => {
        //   if (artists.some(a => a.uid === artist.uid)) {
        //     this.selectedArtistIds.push(artist.uid);
        //   }
        // });
      }));
  }

  saveArtists() {
    this.editing = false;
    console.log(this.selectedArtistIds);
    this.userService.updateUser(this.user.uid, { artists: this.selectedArtistIds });
  }

  cancel() {
    this.editing = false;
    this.selectedArtistIds = this.user.artists.map(a => a.uid);
  }

}
