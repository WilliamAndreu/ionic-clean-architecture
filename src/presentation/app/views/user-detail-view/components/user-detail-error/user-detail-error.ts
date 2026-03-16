import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-user-detail-error',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './user-detail-error.html',
})
export class UserDetailError {
  @Input({ required: true }) message!: string;
  @Input() showLoginButton = false;
  @Output() loginClick = new EventEmitter<void>();
}
