import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CategoriesService } from 'src/app/services/categories.service';

@Component({
  selector: 'app-category-select',
  templateUrl: './category-select.component.html',
  styleUrls: ['./category-select.component.scss']
})
export class CategorySelectComponent implements OnInit {
  categories: string[];
  selected: string;

  fullCategories: any[];
  carouselIndex: number = 0;

  @Output() selectedCategory: EventEmitter<string> = new EventEmitter();

  constructor(private catService: CategoriesService) { }

  ngOnInit() {
    this.fullCategories = [ { name: 'all', icon: 'all_inclusive' }, ...this.catService.getCategories() ];
    this.categories = [ 'all', ...this.fullCategories.map(c => c.name) ];
    this.selected = 'all';
  }

  onSelect(category: string) {
    this.selected = this.selected === category ? 'all' : category;
    this.selectedCategory.emit(this.selected);
  }

  categorySelect(index: number) {
    this.carouselIndex = index;
    this.selected = this.fullCategories[index].name;
    this.selectedCategory.emit(this.selected);
  }

  carouselIndexChanged(index: number) {
    this.carouselIndex = index;
    this.selected = this.fullCategories[index].name;
    this.selectedCategory.emit(this.selected);
  }

}
