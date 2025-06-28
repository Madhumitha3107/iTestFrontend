import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE } from './local-storage.token';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userId: number | null = null;
  private email: string = '';
  private fullName: string = '';
  private country: string = '';
  private phoneNumber: string = '';
  private role:string='';
  constructor( @Inject(LOCAL_STORAGE) private localStorage: Storage,) {}


  setUserInfo(user: { id: number; email: string; fullName: string,country:string,phoneNumber:string }): void {
    this.userId = user.id;
    this.email = user.email;
    this.fullName = user.fullName;
    this.country = user.country;
    this.phoneNumber = user.phoneNumber;
 
    this.localStorage.setItem('user', JSON.stringify(user));
    
  }

  setRole(role: string): void {
    this.role = role;
  }
  getRole(): string {
    return this.role;
  } 
  getUserId(): number | null {
    return this.userId;
  }

  getEmail(): string {
    return this.email;
  }

  getFullName(): string {
    return this.fullName;
  }

  checkIfLoggedIn():boolean{
    if(this.userId!==null){
      return true;
    }
    return false;
  }

  clearUserInfo(): void {
    this.userId = null;
    this.email = '';
    this.fullName = '';
  }
}
