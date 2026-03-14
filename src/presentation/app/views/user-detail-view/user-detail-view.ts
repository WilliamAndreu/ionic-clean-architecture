import { Component, OnInit, inject } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { UserDetailViewModel } from './viewmodel/user-detail.viewmodel';
import { DetailHeader } from '@shared/components/detail-header/detail-header';
import { UserProfileCard } from './components/user-profile-card/user-profile-card';
import { UserDetailLoading } from './components/user-detail-loading/user-detail-loading';
import { UserDetailError } from './components/user-detail-error/user-detail-error';

@Component({
  selector: 'app-user-detail-view',
  standalone: true,

  imports: [IonContent, DetailHeader, UserProfileCard, UserDetailLoading, UserDetailError],
  providers: [UserDetailViewModel],
  templateUrl: './user-detail-view.html',
  styleUrl: './user-detail-view.scss',
})
export class UserDetailView implements OnInit {
  protected readonly vm = inject(UserDetailViewModel);

  ngOnInit(): void {
    this.vm.init();
  }
}
