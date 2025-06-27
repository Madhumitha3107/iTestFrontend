import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import { AppToasterService } from '../services/toaster.service';
import { UserService } from '../userservice.service';
import { LOCAL_STORAGE } from '../local-storage.token';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  hidePassword: boolean = true;
  confirmHidePassword: boolean = true;
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    private userService:UserService,
    private toast: AppToasterService,
     @Inject(LOCAL_STORAGE) private localStorage: Storage,
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

  ngOnInit(): void {
    this.registerForm = this.fb.group(
      {
        fullName: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.pattern(
              '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,}$'
            )
          ]
        ],
        confirmPassword: ['', Validators.required],
        recaptcha: ['', Validators.required]
      },
      {
        validators: [this.passwordMatchValidator]
      }
    );
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      control.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  onSubmit(): void {
  if (this.registerForm.valid) {
    const formValue = this.registerForm.value;

    const payload = {
      fullName: formValue.fullName,
      email: formValue.email,
      password: formValue.password,
      role: 0
    };

    this.api.auth.register(payload).pipe(
      tap((res: any) => {
        const message = typeof res === 'string' ? res : res?.message || 'Registration successful';
        this.toast.success(message);
        this.registerForm.reset();
        this.router.navigate(['/login']);
      }),
      catchError((err) => {
        console.error('Register error:', err);
        this.toast.error(err.error.message);
        return of(null); 
      })
    ).subscribe();
  } else {
    this.toast.error('Please fill all fields correctly');
  }
}
}