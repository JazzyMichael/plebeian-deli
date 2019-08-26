import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  categories: any[] = [
    { name: 'sculpture', icon: 'format_shapes' },
    { name: 'design', icon: 'tonality' },
    { name: 'illustration', icon: 'gesture' },
    { name: 'painting', icon: 'palette' },
    { name: 'photography', icon: 'camera_enhance' },
    { name: 'video', icon: 'videocam' },
    { name: 'typography', icon: 'wb_auto' },
    { name: 'mural art', icon: 'settings_brightness' },
    { name: 'animation', icon: 'landscape' },
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
