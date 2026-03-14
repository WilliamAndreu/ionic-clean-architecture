import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs';
import { StorageSource } from 'src/core/services/storage/source/storage-source.interface';
import { ProductsLocalDataSource } from '../source/products-local.datasource';
import { ProductsDbo, PRODUCTS_CACHE_TTL_MS } from './dbo/products.dbo';

@Injectable()
export class ProductsLocalDataSourceImp extends ProductsLocalDataSource {
  private readonly storage = inject(StorageSource);
  private readonly CACHE_KEY_PREFIX = 'products_skip_';

  override getProducts(skip: number): Observable<ProductsDbo | null> {
    return this.storage.get<ProductsDbo>(this.cacheKey(skip)).pipe(
      map((cached) => {
        if (!cached) return null;
        if (Date.now() - cached.cachedAt > PRODUCTS_CACHE_TTL_MS) return null;
        return cached;
      }),
    );
  }

  override saveProducts(skip: number, data: ProductsDbo): void {
    this.storage.set(this.cacheKey(skip), data).subscribe();
  }

  private cacheKey(skip: number): string {
    return `${this.CACHE_KEY_PREFIX}${skip}`;
  }
}
