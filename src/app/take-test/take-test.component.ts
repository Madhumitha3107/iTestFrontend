import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../api.service';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { UserService } from '../userservice.service';
import { AppToasterService } from '../services/toaster.service';

@Component({
  selector: 'app-take-test',
  templateUrl: './take-test.component.html',
  styleUrls: ['./take-test.component.css']
})
export class TakeTestComponent implements OnInit {
  quizId!: number;
  quizTitle = '';
  description = '';
  questions: any[] = [];
  answers: { [key: number]: string } = {};
  totalMarks: number = 0;
  scoreToPass: number = 0;

  resultData: any = null;

  @ViewChild('resultDialog') resultDialog!: TemplateRef<any>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private toast: AppToasterService,
    private dialog: MatDialog, 
    private userservice:UserService
  ) {}

  ngOnInit(): void {
    this.quizId = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.quizId) {
      this.toast.error('Invalid Quiz ID');
      return;
    }

    this.api.user.getQuizById(this.quizId).pipe(
      tap(res => {
        if (!res.success) {
          this.toast.error(res.message || 'Failed to load quiz.');
          this.router.navigate(['/quiz']);
        }
      }),
      map(res => {
        const quiz = res.data;
        this.quizTitle = quiz.title;
        this.description = quiz.description;
        this.totalMarks = quiz.totalMarks;
        this.scoreToPass = quiz.scoreToPass;
        this.questions = quiz.questions.map((q: any) => ({
          id: q.id,
          questionText: q.text,
          options: [
            { label: 'A', value: q.optionA },
            { label: 'B', value: q.optionB },
            { label: 'C', value: q.optionC },
            { label: 'D', value: q.optionD }
          ]
        }));
      }),
      catchError(err => {
        this.toast.error('Error loading quiz. Try again later.');
        return of(null);
      })
    ).subscribe();
  }

  selectAnswer(questionId: number, answer: string): void {
    this.answers[questionId] = answer;
  }

  submitQuiz(): void {
    const userId = this.userservice.getUserId(); 
    if (!userId) {
      this.toast.error('User not logged in. Please log in again.');
      return;
    }

    const submission = {
      userId: userId,
      answers: this.questions.map(q => ({
        questionId: q.id,
        selectedOption: this.answers[q.id] || ''
      }))
    };

    this.api.user.submitQuiz(this.quizId, submission).pipe(
      tap(res => {
        if (res.success) {
          this.resultData = res.data;
          this.dialog.open(this.resultDialog, {
            width: '500px',
            disableClose: true
          });
        } else {
          this.toast.error(res.message || 'Submission failed.');
        }
      }),
      catchError(err => {
        console.error('Error from API:', err);
        this.toast.error('Error submitting quiz.');
        return of(null);
      })
    ).subscribe();
  }

  proceed(): void {
    this.dialog.closeAll();
    this.router.navigate(['/dashboard']);
  }
}