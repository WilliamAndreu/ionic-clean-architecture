import { Component, OnInit, ViewChild, effect, inject } from '@angular/core';
import { IonContent, IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/angular/standalone';
import { ProductsViewModel } from './viewmodel/products.viewmodel';
import { ProductsHeader } from './components/products-header/products-header';
import { ProductsGrid } from './components/products-grid/products-grid';
import { ProductsLoading } from './components/products-loading/products-loading';
import { ProductsError } from './components/products-error/products-error';

@Component({
  selector: 'app-products-list-view',
  standalone: true,

  imports: [
    IonContent,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    ProductsHeader,
    ProductsGrid,
    ProductsLoading,
    ProductsError,
  ],
  providers: [ProductsViewModel],
  templateUrl: './products-list-view.html',
  styleUrl: './products-list-view.scss',
})
export class ProductsListView implements OnInit {
  protected readonly vm = inject(ProductsViewModel);

  @ViewChild(IonInfiniteScroll) private readonly infiniteScroll?: IonInfiniteScroll;

  constructor() {
    // Complete the infinite scroll when loading finishes
    effect(() => {
      if (!this.vm.viewState.isLoading()) {
        this.infiniteScroll?.complete();
      }
    });
  }

  ngOnInit(): void {
    this.vm.init();
  }

  protected onSearchInput(value: string): void {
    this.vm.updateSearchTerm(value);
  }

  protected onIonInfinite(): void {
    if (!this.vm.viewState.hasNextPage()) return;
    this.vm.loadMore();
  }
}
