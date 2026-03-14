import { Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-product-detail-error',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './product-detail-error.html',
})
export class ProductDetailError {
  @Input({ required: true }) message!: string;
}
