import { Component, Inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { LOCAL_STORAGE } from '../local-storage.token';
import { UserService } from '../userservice.service';
@Component({
  selector: 'app-shared-layout',
  templateUrl: './shared-layout.component.html',
  styleUrls: ['./shared-layout.component.css']
})
export class SharedLayoutComponent {
  isSmallScreen: boolean = false;
  pageTitle: string = '';

  constructor(private router: Router,private breakpointObserver: BreakpointObserver, @Inject(LOCAL_STORAGE) private localStorage: Storage,private userService: UserService) {
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
      this.isSmallScreen = result.matches;
    });
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const url = this.router.url;
        this.setPageTitle(url);
      });
  }

  logOut() {
   
    this.localStorage.removeItem('user');
    this.userService.clearUserInfo();
    this.router.navigate(['/login']);
  }

  setPageTitle(url: string) {
    if (url.includes('/dashboard')) {
      this.pageTitle = 'Dashboard';
    } else if (url.includes('/quiz')) {
      this.pageTitle = 'Quiz';
    } else if (url.includes('/profile-edit')) {
      this.pageTitle = 'Edit Profile';
    } else {
      this.pageTitle = 'Test';
    }
  }
}