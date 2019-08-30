import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  isDarkTheme: BehaviorSubject<boolean> = new BehaviorSubject(true);

  constructor() { }
}
