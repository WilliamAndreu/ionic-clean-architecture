import { Component } from '@angular/core';
import { IonRouterOutlet } from '@ionic/angular/standalone';

@Component({
  selector: 'app-public-layout',
  imports: [IonRouterOutlet],
  template: `<ion-router-outlet />`,
  standalone: true,
})
export class PublicLayout {}
