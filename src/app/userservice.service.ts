import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userId: number | null = null;
  private email: string = '';
  private fullName: string = '';
  private country: string = '';
  private phoneNumber: string = '';

  constructor() {}

  // Save user data
  setUserInfo(user: { id: number; email: string; fullName: string,country:string,phoneNumber:string }): void {
    this.userId = user.id;
    this.email = user.email;
    this.fullName = user.fullName;
    this.country = user.country;
    this.phoneNumber = user.phoneNumber;
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

  // Optional - Clear on logout
  clearUserInfo(): void {
    this.userId = null;
    this.email = '';
    this.fullName = '';
  }
}
