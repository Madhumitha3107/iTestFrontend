import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { catchError, map, of, tap } from 'rxjs';
import { UserService } from '../userservice.service';
import { AppToasterService } from '../services/toaster.service';

export interface Quiz {
  id: number;
  title: string;
  description: string;
  scheduledAt: string;
}

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {
  quizzes: Quiz[] = [];
  loading: boolean = true;

  constructor(
    private router: Router,
    private api: ApiService,
    private toast: AppToasterService,
    private userservice: UserService
  ) {}

  ngOnInit(): void {
    const userId = this.userservice.getUserId();
    if (!userId) {
      this.toast.error('No user id available');
      this.loading = false;
      return;
    }

    this.api.user.getAvailableQuizzes(userId).pipe(
      tap(res => {
        if (!res.success) {
          this.toast.error(res.message || 'Failed to load quizzes');
        }
      }),
      map(res => (res.success ? res.data : [])),
      catchError(() => {
        this.toast.error('Error fetching quizzes');
        return of([]);
      })
    ).subscribe(data => {
      this.quizzes = data;
      this.loading = false;
    });
  }

  confirmAndNavigate(quizId: number): void {
    this.router.navigate(['/take-test', quizId]);
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
