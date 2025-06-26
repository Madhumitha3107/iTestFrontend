import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { UserService } from '../userservice.service';
import { ToastService } from '../toast.service';
import { AppToasterService } from '../services/toaster.service';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})
export class ProfileEditComponent implements OnInit {
  profileData = {
    email: '',
    name: '',
    mobile: '',
    country: '',
    gender: ''
  };

  userId!: number;

  constructor(
    private api: ApiService,
    private userService: UserService,
    private toast: AppToasterService
  ) {}

  ngOnInit(): void {
  this.userId = this.userService.getUserId()!;
  if (!this.userId) return;

  this.api.get<any>(`User/${this.userId}/profile`).subscribe(res => {
    if (res.success && res.data) {
      const data = res.data;
    

      this.profileData.name = (data.fullName && data.fullName !== 'string') ? data.fullName : '';
      this.profileData.mobile = (data.phoneNumber && data.phoneNumber !== 'string') ? data.phoneNumber : '';
      this.profileData.country = (data.country && data.country !== 'string') ? data.country : '';
      this.profileData.gender = (data.gender && data.gender !== 'string') ? data.gender : '';
      this.profileData.email = this.userService.getEmail() || '';
    }
  });
}

  onSubmit(form: any): void {
    if (form.valid) {
      const payload = {
        fullName: this.profileData.name,
        phoneNumber: this.profileData.mobile,
        country: this.profileData.country,
        gender: this.profileData.gender
      };

      this.api.user.updateProfile(this.userId, payload).subscribe(res => {
        if (res.success) {
          const data = res.data;
        this.userService.setUserInfo({
        id: this.userId,
        email: this.userService.getEmail() || '',
        fullName: data.fullName,
        country: data.country,
        phoneNumber: data.phone
      });
      
          this.toast.success('Profile updated successfully!');
        } else {
          this.toast.error('Failed to update profile');
        }
      });
    } else {
      this.toast.info('Please fill all fields correctly');
    }
  }
}
