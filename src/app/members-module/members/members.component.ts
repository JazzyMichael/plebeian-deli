import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CategoriesService } from '../../services/categories.service';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
})
export class MembersComponent implements OnInit {
  debounce: any;
  users$: Observable<any>;
  categoryNames: string[];
  selectedCategories: any[];
  searchTerm: string;

  constructor(private userService: UserService, private catService: CategoriesService) { }

  ngOnInit() {
    this.setUsers();
    this.categoryNames = this.catService.getCategoryNames();
  }

  setUsers() {
    this.users$ = this.userService.users$.asObservable().pipe(
      map(users => this.categoryFilter(users, this.selectedCategories))
    );
  }

  setSearchUsers(term: string = '') {
    this.users$ = this.userService.searchUsers(term).pipe(
      map(users => this.categoryFilter(users, this.selectedCategories))
    );
  }

  setCategoryUsers(categories: string[] = []) {
    if (!categories.length || categories.length > 10) return this.setUsers();
    this.users$ = this.userService.getUsersByCategories(categories);
  }

  onScroll() {
    if (!this.searchTerm) this.userService.getMoreUsers();
  }

  searchInput() {
    if (this.debounce) {
      clearTimeout(this.debounce);
    }

    this.debounce = setTimeout(() => {
      if (this.searchTerm) {
        this.setSearchUsers(this.searchTerm);
      } else {
        this.setUsers();
      }
    }, 1000);
  }

  categorySelect() {
    if (this.searchTerm) {
      this.setSearchUsers(this.searchTerm);
    } else {
      this.setCategoryUsers(this.selectedCategories.map(x => x.toLowerCase()));
    }
  }

  categoryFilter(users: any[] = [], selected: any[] = []) {
    if (!selected.length) return users;

    return users.filter(user =>
      user.medium &&
      selected.some(cat => cat.toLowerCase() === user.medium.toLowerCase())
    );
  }

}
