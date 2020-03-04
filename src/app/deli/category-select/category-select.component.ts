import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CategoriesService } from 'src/app/services/categories.service';
import { AngularFireAnalytics } from '@angular/fire/analytics';

@Component({
  selector: 'app-category-select',
  templateUrl: './category-select.component.html',
  styleUrls: ['./category-select.component.scss']
})
export class CategorySelectComponent implements OnInit {
  selected: string;
  fullCategories: any[];

  @Output() selectedCategory: EventEmitter<string> = new EventEmitter();

  constructor(private catService: CategoriesService, private analytics: AngularFireAnalytics) { }

  ngOnInit() {
    this.fullCategories = [ { name: 'all', icon: 'all_inclusive' }, ...this.catService.getCategories() ];
    this.selected = 'all';
  }

  onSelect(category: string) {
    if (this.selected === category) return;
    this.selected = category;
    this.selectedCategory.emit(this.selected);
    this.analytics.logEvent('category-select', { category: this.selected });
  }

}
