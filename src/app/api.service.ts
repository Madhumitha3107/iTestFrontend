import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly API_ROOT = 'https://vtjf237h-5274.inc1.devtunnels.ms/api/'; 

  constructor(private http: HttpClient) {}


  public get<T>(url: string, params?: HttpParams): Observable<T> {
    return this.http.get<T>(`${this.API_ROOT}${url}`, {
      params,
      withCredentials: true
    });
  }

 
  private post<T>(url: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.API_ROOT}${url}`, body, {
      withCredentials: true
    });
  }

  
  private put<T>(url: string, body: any): Observable<T> {
    return this.http.put<T>(`${this.API_ROOT}${url}`, body, {
      withCredentials: true
    });
  }

  
  private patch<T>(url: string, body: any): Observable<T> {
    return this.http.patch<T>(`${this.API_ROOT}${url}`, body, {
      withCredentials: true
    });
  }

 
  private delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(`${this.API_ROOT}${url}`, {
      withCredentials: true
    });
  }

  auth = {

  register: (userData: {
    fullName: string;
    email: string;
    password: string;
    role: number;
  }) => this.post('Auth/register', userData),

  login: (credentials: {
    email: string;
    password: string;
  }) => this.post('Auth/login', credentials),

  forgotPassword: (email: string) =>
  this.post('Auth/forgot-password', { email }),

  resetPassword: (payload: { token: string; newPassword: string }) =>
  this.post('Auth/reset-password', payload),
  };

  quiz = {
  getAll: (): Observable<any> => this.get('Quiz')
};

user = {
    updateProfile: (userId: number, profileData: any): Observable<any> => 
      this.patch(`User/${userId}/profile`, profileData),
    
    getUserStats: (userId: number): Observable<any> => 
      this.get(`User/${userId}/stats`),
    
    getUserResults: (userId: number): Observable<any> => 
      this.get(`User/${userId}/results`),
    
    getQuizById: (id: number): Observable<any> => 
      this.get(`User/quiz/${id}`),
      getAvailableQuizById: (id: number,quizId:number): Observable<any> => 
      this.get(`User/check-availability/${quizId}/user/${id}`),
    
    // getAvailableQuizzes: (id:number): Observable<any> => 
    //   this.get(`User/${id}/available-quizzes`),
    
    submitQuiz: (quizId: number, submission: any): Observable<any> => 
      this.post(`Quiz/${quizId}/submit`, submission),

    getUserHistory: (userId: number, page: number, limit: number = 10) =>
    this.get(`User/user-history/${userId}/page/${page}`, new HttpParams().set('limit', limit.toString())),

    getRecentQuizzes: (userId: number): Observable<any> =>
    this.get(`User/${userId}/recent-quizzes`),


  };
  

    getAvailableQuizzes(userId: number, category: string = '', search: string = '') {
    let params = new HttpParams();
    if (category) params = params.set('category', category);
    if (search) params = params.set('search', search);

    return this.get(`User/${userId}/available-quizzes`, params);
  }

  getQuestionCategories(id: number = 0): Observable<any> {
    return this.get(`User/question-categories/${id}`);
  }


}
