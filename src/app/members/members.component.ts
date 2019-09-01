import { Component, OnInit, Renderer2 } from '@angular/core';
import { UserService } from '../services/user.service';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { CategoriesService } from '../services/categories.service';
import { AuthService } from '../services/auth.service';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
})
export class MembersComponent implements OnInit {

  categories: any[];

  users$;

  selectedCategories: any[];
  searchTerm: string;
  membership: string;
  radioSelection: string = null;

  constructor(
    public userService: UserService,
    private catService: CategoriesService,
    private ren: Renderer2,
    private authService: AuthService,
    private chatService: ChatService
    ) { }

  ngOnInit() {
    this.filterUsers();

    this.categories = this.catService.getCategories().map(c => c.name);
  }

  filterUsers() {
    this.users$ = this.userService.users$.pipe(
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

  radioClick(el) {
    setTimeout(() => {
      if (this.radioSelection === el.value) {
        el.checked = false;
        this.ren.removeClass(el._elementRef.nativeElement, 'cdk-focused');
        this.ren.removeClass(el._elementRef.nativeElement, 'cdk-program-focused');
        this.radioSelection = null;
        this.membership = null;
      } else {
        this.radioSelection = el.value;
      }
    });
  }

  change() {
    this.filterUsers();
  }

  async sendMessage(memberUid: string) {
    const user = await this.authService.getCurrentUser();
    this.chatService.initiateChat(user.uid, memberUid);
  }

}
