import { Component, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ApiService } from '../api.service';
import { UserService } from '../userservice.service';
import { LOCAL_STORAGE } from '../local-storage.token';
import { AppToasterService } from '../services/toaster.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  hidePassword: boolean = true;

  email: string = '';
  password: string = '';
  captchaToken: string | null = null;
  captchaError: boolean = false;

  constructor(
    private router: Router,
    private api: ApiService,
    private userService: UserService,
    @Inject(LOCAL_STORAGE) private localStorage: Storage,
    private toast: AppToasterService
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


  

  onCaptchaResolved(token: string) {
    this.captchaToken = token;
    this.captchaError = false;
    console.log('CAPTCHA Token:', token);
  }


  onSubmit(form: NgForm) {
    if (!this.captchaToken) {
      this.captchaError = true;
      console.warn('CAPTCHA not completed');
      return;
    }

    if (form.valid) {
      const payload = {
        email: this.email,
        password: this.password
      };

      this.api.auth.login(payload).pipe(
        tap((res: any) => {
          if (res?.success && res?.data) {
            const user = res.data;
            this.userService.setUserInfo({
              id: user.id,
              email: user.email,
              fullName: user.fullName,
              country: user.country,
              phoneNumber: user.phoneNumber
            });
            this.userService.setRole(user.role);
            this.localStorage.setItem('user', JSON.stringify(user));
            this.router.navigate(['/dashboard',1]);
          } else {
            this.toast.error(res?.message || 'Login failed');
          }
        }),
        catchError((err) => {
          console.error('Login failed:', err);
          this.toast.error(err.error.message || 'Login failed. Please try again.');
          return of(null);
        })
      ).subscribe();
    } else {
      this.toast.info('Please fill all required fields correctly.');
    }
  }

  onRegister() {
    this.router.navigate(['/register']);
  }

  onForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }
}
