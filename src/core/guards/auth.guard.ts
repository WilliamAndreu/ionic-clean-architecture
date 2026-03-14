import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { StorageSource } from 'src/core/services/storage/source/storage-source.interface';

export const authGuard: CanActivateFn = () => {
  const storage = inject(StorageSource);
  const router = inject(Router);

  return storage
    .get<string>('access_token')
    .pipe(map((token) => (token ? true : router.createUrlTree(['/login']))));
};
