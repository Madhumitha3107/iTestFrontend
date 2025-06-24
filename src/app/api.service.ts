import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly API_ROOT = 'https://vtjf237h-5274.inc1.devtunnels.ms/api/'; 

  constructor(private http: HttpClient) {}

  // Base GET method
  private get<T>(url: string, params?: HttpParams): Observable<T> {
    return this.http.get<T>(`${this.API_ROOT}${url}`, {
      params,
      withCredentials: true
    });
  }

  // Base POST method
  private post<T>(url: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.API_ROOT}${url}`, body, {
      withCredentials: true
    });
  }

  // Base PUT method
  private put<T>(url: string, body: any): Observable<T> {
    return this.http.put<T>(`${this.API_ROOT}${url}`, body, {
      withCredentials: true
    });
  }

  // Base PATCH method
  private patch<T>(url: string, body: any): Observable<T> {
    return this.http.patch<T>(`${this.API_ROOT}${url}`, body, {
      withCredentials: true
    });
  }

  // Base DELETE method
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
      this.put(`User/${userId}/profile`, profileData),
    
    getUserStats: (userId: number): Observable<any> => 
      this.get(`User/${userId}/stats`),
    
    getUserResults: (userId: number): Observable<any> => 
      this.get(`User/${userId}/results`),
    
    getQuizById: (id: number): Observable<any> => 
      this.get(`User/quiz/${id}`),
    
    getAvailableQuizzes: (id:number): Observable<any> => 
      this.get(`User/${id}/available-quizzes`),
    
    submitQuiz: (quizId: number, submission: any): Observable<any> => 
      this.post(`Quiz/${quizId}/submit`, submission)
  };





  // You will define specific API groups like `auth`, `quiz`, `user`, etc. below as we go
}
