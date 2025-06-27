import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  private defaultDuration = 3000;  
  private defaultHorizontalPosition: MatSnackBarHorizontalPosition = 'right';
  private defaultVerticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(private snackBar: MatSnackBar) {}

  show(message: string, action = 'Close', duration?: number,
       horizontalPosition?: MatSnackBarHorizontalPosition,
       verticalPosition?: MatSnackBarVerticalPosition) {

    const config: MatSnackBarConfig = {
      duration: duration ?? this.defaultDuration,
      horizontalPosition: horizontalPosition ?? this.defaultHorizontalPosition,
      verticalPosition: verticalPosition ?? this.defaultVerticalPosition,
    };

    this.snackBar.open(message, action, config);
  }
}
