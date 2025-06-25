import { Inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from '../userservice.service';
import { LOCAL_STORAGE } from '../local-storage.token';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private userService:UserService, @Inject(LOCAL_STORAGE) private localStorage: Storage) {}

  canActivate(): boolean {

    if(this.userService.getUserId()==null && this.localStorage.getItem('user')==null) {
      this.router.navigate(['/login']);
      return false;
    }
    if (this.userService.getUserId()==null && this.localStorage.getItem('user')!==null) {
      const user = JSON.parse(this.localStorage.getItem('user') || '{}');
      this.userService.setUserInfo({
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        country: user.country,
        phoneNumber: user.phoneNumber
      });
      return true;
    }
    if (this.userService.getUserId()!==null) {
      return true;
    }
    else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
