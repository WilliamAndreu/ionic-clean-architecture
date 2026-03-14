import { Component, inject } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { LoginViewModel } from './viewmodel/login.viewmodel';
import { LoginHeader } from './components/login-header/login-header';
import { LoginForm, LoginFormValue } from './components/login-form/login-form';
import { LoginFooter } from './components/login-footer/login-footer';

@Component({
  selector: 'app-login-view',
  standalone: true,
  imports: [IonContent, LoginHeader, LoginForm, LoginFooter],
  providers: [LoginViewModel],
  templateUrl: './login-view.html',
  styleUrl: './login-view.scss',
})
export class LoginView {
  protected readonly vm = inject(LoginViewModel);

  protected onSubmit({ username, password }: LoginFormValue): void {
    this.vm.login(username, password);
  }
}
