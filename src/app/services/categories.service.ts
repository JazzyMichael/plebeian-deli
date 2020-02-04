import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  categories: any[] = [
    { name: 'sculpture', icon: 'format_shapes', color: '#89fdf6' },
    { name: 'design', icon: 'tonality', color: '#9888ff' },
    { name: 'illustration', icon: 'gesture', color: '#ff5959' },
    { name: 'painting', icon: 'palette', color: '#ff9f59' },
    { name: 'photography', icon: 'camera_enhance', color: '#fdf5a2' },
    { name: 'animation', icon: 'landscape', color: '#4caf50' },
    { name: 'video', icon: 'videocam' },
    { name: 'typography', icon: 'wb_auto' },
    { name: 'mural art', icon: 'settings_brightness' },
    { name: 'mixed media', icon: 'computer' },
    { name: 'ceramics', icon: 'texture' },
    { name: 'metal', icon: 'settings_applications' },
    { name: 'glass', icon: 'whatshot' }
  ];

  constructor() { }

  getCategories() {
    return this.categories;
  }
}
