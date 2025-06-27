import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { UserService } from '../userservice.service';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ChartOptions, TooltipItem } from 'chart.js';
import { HttpParams } from '@angular/common/http';
import { AppToasterService } from '../services/toaster.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  toISTDate(dateString: string): Date | null {
    if (!dateString) return null;
    const utcDate = new Date(dateString);
    const istOffset = 5.5 * 60 * 60 * 1000; 
    return new Date(utcDate.getTime() + istOffset);
  }

  upcomingQuizzes: any[] = [];
  quizHistory: any[] = [];
  stats: any;
  currentPage: number = 1;
  totalPages: number = 1;
  limit: number = 10;
  userId!: number;
  statsLoading = true;
  quizzesLoading = true;
  historyLoading = true;

  lineChartData = {
    labels: [] as string[],
    datasets: [
      {
        data: [] as number[],
        label: 'Score',
        borderColor: '#3f51b5',
        backgroundColor: 'rgba(63,81,181,0.2)',
        tension: 0.3,
        fill: true
      }
    ]
  };

  lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'bottom' },
      tooltip: {
        callbacks: {
          title: () => '',

        
        label: (tooltipItem: TooltipItem<'line'>) => {
          const score = tooltipItem.parsed.y;
          const quizTitle = this.stats?.lineGraph[tooltipItem.dataIndex]?.quizTitle || '';
          return `${quizTitle}: ${score}`;
        
          }
        }
      }
    },
    scales: {
      x: {
        title: { display: true, text: 'Attempted Date' },
        ticks: {
          callback: function (val: any) {
            const label = this.getLabelForValue(val);
            const date = new Date(label);
            return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}`;
          }
        }
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Score' }
      }
    }
  };

  pieChartLabels = ['Passed', 'Failed'];
  pieChartData: number[] = [];
  pieChartColors = ['#4caf50', '#f44336'];

  pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'bottom' }
    }
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private api: ApiService,
    private toast: AppToasterService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userId = this.userService.getUserId()!;
    if (!this.userId) return;

    this.loadStats();
    this.loadUpcomingQuizzes();

    this.route.paramMap.subscribe(paramMap => {
      const pageParam = paramMap.get('page');
      this.currentPage = pageParam ? parseInt(pageParam, 10) : 1;
      this.loadQuizHistory(this.currentPage);
      window.scrollTo(0, 0);
    });
  }

  loadStats(): void {
    this.statsLoading = true;
    this.api.user.getUserStats(this.userId).pipe(
      tap(res => {
        if (res.success) {
          this.stats = res.data;
          const line = res.data.lineGraph;
          this.lineChartData.labels = line.map((d: any) => d.attemptedAt);
          this.lineChartData.datasets[0].data = line.map((d: any) => d.score);
          this.pieChartData = [res.data.pieChart.passed, res.data.pieChart.failed];
        }
        this.statsLoading = false;
      }),
      catchError(() => {
        this.toast.error('Failed to load user stats');
        this.statsLoading = false;
        return of(null);
      })
    ).subscribe();
  }

  loadUpcomingQuizzes(): void {
    this.quizzesLoading = true;
    this.api.get<any>(`User/${this.userId}/recent-quizzes`).pipe(
      tap(res => {
        if (res.success && res.data) {
          this.upcomingQuizzes = res.data.slice(0, 6);
        }
        this.quizzesLoading = false;
      }),
      catchError(() => {
        this.toast.error('Failed to load upcoming quizzes');
        this.quizzesLoading = false;
        return of([]);
      })
    ).subscribe();
  }

  loadQuizHistory(page: number): void {
    this.historyLoading = true;
    const params = new HttpParams().set('limit', this.limit.toString());

    this.api.get<any>(`User/user-history/${this.userId}/page/${page}`, params).pipe(
      tap(res => {
        if (res.success) {
          this.quizHistory = res.data.map((item: any) => ({
            name: item.quizTitle,
            marks: item.score,
            total: item.totalMarks,
            passed: item.passed
          }));
          this.totalPages = res.totalPages;
        }
        this.historyLoading = false;
      }),
      catchError(() => {
        this.toast.error('Failed to load quiz history');
        this.historyLoading = false;
        return of(null);
      })
    ).subscribe();
  }

  changePage(delta: number): void {
    const nextPage = this.currentPage + delta;
    if (nextPage >= 1 && nextPage <= this.totalPages) {
      this.router.navigate(['/dashboard', nextPage]);
    }
  }

  confirmAndNavigate(quizId: number): void {
    this.router.navigate(['/take-test', quizId]);
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
