import { InjectionToken } from '@angular/core';

export const LOCAL_STORAGE = new InjectionToken<Storage>(
  'LocalStorage',
  {
    providedIn: 'root',
    factory: () => localStorage
  }
);
