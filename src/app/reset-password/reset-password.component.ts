import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { ToastService } from '../toast.service';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

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
    private toast: ToastService
  ) {}

  onReset(form: any): void {
  if (form.valid && this.password === this.confirmPassword) {
    const payload = {
      token: this.token,
      newPassword: this.password
    };

    this.api.auth.resetPassword(payload).pipe(
      tap((res: any) => {
        const message = typeof res === 'string' ? res : res?.message || 'Password reset successful!';
        this.toast.show(message, 'Close');
        this.router.navigate(['/login']);
      }),
      catchError(err => {
        console.error('Password reset failed:', err);
        const errorMessage = err?.error?.message || 'Invalid or expired token. Please try again.';
        this.toast.show(errorMessage, 'Close');
        return of(null);
      })
    ).subscribe();
  } else {
    this.toast.show('Please fix the errors before submitting.', 'Close');
  }
}

}
