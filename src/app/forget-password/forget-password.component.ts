import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { ToastService } from '../toast.service';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

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
    private toast: ToastService
  ) {}

  sendToken(): void {
  if (!this.email) {
    this.toast.show('Please enter your registered email.', 'Close');
    return;
  }

  this.api.auth.forgotPassword(this.email).pipe(
    tap((res: any) => {
      const message = typeof res === 'string' ? res : res?.message || 'Reset token sent successfully.';
      this.toast.show(message, 'Close');
      this.router.navigate(['/reset-password']);
    }),
    catchError(err => {
      console.error('Error sending reset token:', err);
      const errorMessage = err?.error?.message || 'Failed to send reset token. Please try again.';
      this.toast.show(errorMessage, 'Close');
      return of(null);
    })
  ).subscribe();
}

}
