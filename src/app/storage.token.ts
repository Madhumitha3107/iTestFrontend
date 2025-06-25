// src/app/storage.token.ts
import { InjectionToken } from '@angular/core';

export const LOCAL_STORAGE = new InjectionToken<Storage>(
  'Window LocalStorage',
  {
    providedIn: 'root',
    factory: () => localStorage
  }
);
 