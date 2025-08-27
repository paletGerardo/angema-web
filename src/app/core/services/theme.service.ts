import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkMode = new BehaviorSubject<boolean>(true); // Inicializar en true para modo oscuro por defecto
  darkMode$ = this.darkMode.asObservable();

  constructor() {
    // FORZAR MODO OSCURO SIEMPRE - ignorar localStorage
    this.enableDarkMode();
  }

  toggleTheme(): void {
    if (this.darkMode.value) {
      this.disableDarkMode();
    } else {
      this.enableDarkMode();
    }
  }

  private enableDarkMode(): void {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
    this.darkMode.next(true);
  }

  private disableDarkMode(): void {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
    this.darkMode.next(false);
  }
} 