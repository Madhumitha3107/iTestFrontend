import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AppToasterService } from '../services/toaster.service';
import { UserService } from '../userservice.service';
import { LOCAL_STORAGE } from '../local-storage.token';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent {
  public loading: boolean = false;
  email: string = '';

  constructor(
    private api: ApiService,
    private router: Router,
    private toast: AppToasterService,
    private userService:UserService,
    @Inject(LOCAL_STORAGE) private localStorage:Storage,

  ) {
    if(this.localStorage.getItem('user')!==null){

      const user = JSON.parse(this.localStorage.getItem('user') || '{}');
      this.userService.setUserInfo({
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        country: user.country,
        phoneNumber: user.phoneNumber
      });
      router.navigate(["/dashboard"])
    }
  }

  sendToken(): void {
  if (!this.email) {
    this.toast.error('Please enter your registered email.');
    return;
  }

  this.api.auth.forgotPassword(this.email).pipe(
    tap((res: any) => {
      const message = typeof res === 'string' ? res : res?.message || 'Reset token sent successfully.';
      this.toast.success(message);
      this.router.navigate(['/reset-password']);
    }),
    catchError(err => {
      console.error('Error sending reset token:', err);
      const errorMessage = err?.error?.message || 'Failed to send reset token. Please try again.';
      this.toast.error(errorMessage);
      return of(null);
    })
  ).subscribe();
}

}
