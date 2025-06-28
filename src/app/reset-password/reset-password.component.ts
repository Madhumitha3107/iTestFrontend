import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AppToasterService } from '../services/toaster.service';
import { LOCAL_STORAGE } from '../local-storage.token';
import { UserService } from '../userservice.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  hidePassword: boolean = true;
  confirmHidePassword: boolean = true;
  token: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(
    private router: Router,
    private api: ApiService,
    private toast: AppToasterService,
    @Inject(LOCAL_STORAGE) private localStorage:Storage,
    private userService:UserService
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

  onReset(form: any): void {
  if (form.valid && this.password === this.confirmPassword) {
    const payload = {
      token: this.token,
      newPassword: this.password
    };

    this.api.auth.resetPassword(payload).pipe(
      tap((res: any) => {
        const message = typeof res === 'string' ? res : res?.message || 'Password reset successful!';
        this.toast.success(message);
        this.router.navigate(['/login']);
      }),
      catchError(err => {
        console.error('Password reset failed:', err);
        const errorMessage = err?.error?.message || 'Invalid or expired token. Please try again.';
        this.toast.error(err.error.message || errorMessage);
        return of(null);
      })
    ).subscribe();
  } else {
    this.toast.error('Please fix the errors before submitting.');
  }
}

}
