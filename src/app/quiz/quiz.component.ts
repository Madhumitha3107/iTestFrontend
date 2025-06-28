import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, of, combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ApiService } from '../api.service';
import { UserService } from '../userservice.service';
import { AppToasterService } from '../services/toaster.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {
  quizzes$: Observable<any[]> = of([]);
  categories: any[] = [];

  searchTerm$ = new BehaviorSubject<string>('');
  selectedCategory$ = new BehaviorSubject<string>('');

  searchTerm = '';
  selectedCategory = '';

  constructor(
    private api: ApiService,
    private userservice: UserService,
    private toast: AppToasterService,
    private router: Router
  ) {}

  toISTDate(dateString: string): Date | null {
    if (!dateString) return null;
    const utcDate = new Date(dateString);
    const istOffset = 5.5 * 60 * 60 * 1000;
    return new Date(utcDate.getTime() + istOffset);
  }

  ngOnInit(): void {
    const userId = this.userservice.getUserId();
    if (!userId) {
      this.toast.error('User not found');
      return;
    }

    this.api.getQuestionCategories(userId).subscribe((res: any) => {
      if (res.success) {
        this.categories = res.data;
      }
    });

    this.quizzes$ = combineLatest([
      this.searchTerm$,
      this.selectedCategory$
    ]).pipe(
      switchMap(([search, category]) =>
        this.api
          .getAvailableQuizzes(userId, category, search)
          .pipe(map((res: any) => (res.success ? res.data : [])))
      )
    );
  }

  setSearch(value: string) {
    this.searchTerm = value;
    this.searchTerm$.next(value);
  }

  setCategory(value: string) {
    this.selectedCategory = value;
    this.selectedCategory$.next(value);
  }

  confirmAndNavigate(id: number) {
    this.router.navigate(['/take-test', id]);
  }
}
