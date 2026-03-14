import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { switchMap } from 'rxjs';
import { StorageSource } from 'src/core/services/storage/source/storage-source.interface';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const storage = inject(StorageSource);

  return storage.get<string>('access_token').pipe(
    switchMap((token) => {
      if (!token) return next(req);
      return next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
    }),
  );
};
