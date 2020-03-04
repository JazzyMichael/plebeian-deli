import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { switchMap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { CategoriesService } from '../../services/categories.service';
import { AuthService } from '../../services/auth.service';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
})
export class MembersComponent implements OnInit {

  users$: Observable<any>;
  categoryNames: string[];
  selectedCategories: any[];
  searchTerm: string;

  constructor(
    public userService: UserService,
    private catService: CategoriesService,
    private authService: AuthService,
    private chatService: ChatService
  ) { }

  ngOnInit() {
    this.filterUsers();
    this.categoryNames = this.catService.getCategoryNames();
  }

  onScroll() {
    this.userService.getMoreUsers();
  }

  filterUsers() {
    this.users$ = this.userService.users$.asObservable().pipe(
      switchMap(users => {
        if (!this.searchTerm && (!this.selectedCategories || !this.selectedCategories.length)) {
          return of(users);
        }

        const filtered = users.filter(user => {
          let validCategory: boolean;

          if (this.selectedCategories && this.selectedCategories.length) {
            validCategory = this.selectedCategories.some(c => {
              return user.medium && c.toLowerCase() === user.medium.toLowerCase();
            });
          } else {
            validCategory = true;
          }

          const lowerCaseSearchTerm = this.searchTerm ? this.searchTerm.toLowerCase() : '';
          const lowerCaseUsername = user.username ? user.username.toLowerCase() : '';

          const re = new RegExp(lowerCaseSearchTerm);

          const validSearch = this.searchTerm ? re.test(lowerCaseUsername) : true;

          return validCategory && validSearch;
        });

        return of(filtered);
      })
    );
  }

  change() {
    this.filterUsers();
  }

  async sendMessage(memberUid: string) {
    const user = await this.authService.getCurrentUser();
    this.chatService.initiateChat(user.uid, memberUid);
  }

}
