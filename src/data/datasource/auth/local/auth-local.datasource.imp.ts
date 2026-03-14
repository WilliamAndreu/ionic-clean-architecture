import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { forkJoin, map } from 'rxjs';
import { StorageSource } from 'src/core/services/storage/source/storage-source.interface';
import { AuthLocalDataSource } from '../source/auth-local.datasource';
import { TokensDbo } from './dbo/auth.dbo';

@Injectable()
export class AuthLocalDataSourceImp extends AuthLocalDataSource {
  private readonly storage = inject(StorageSource);

  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';

  override saveTokens(tokens: TokensDbo): Observable<void> {
    return forkJoin([
      this.storage.set(this.ACCESS_TOKEN_KEY, tokens.accessToken),
      this.storage.set(this.REFRESH_TOKEN_KEY, tokens.refreshToken),
    ]).pipe(map(() => undefined));
  }

  override getAccessToken(): Observable<string | null> {
    return this.storage.get<string>(this.ACCESS_TOKEN_KEY);
  }

  override getRefreshToken(): Observable<string | null> {
    return this.storage.get<string>(this.REFRESH_TOKEN_KEY);
  }

  override clearTokens(): Observable<void> {
    return forkJoin([
      this.storage.remove(this.ACCESS_TOKEN_KEY),
      this.storage.remove(this.REFRESH_TOKEN_KEY),
    ]).pipe(map(() => undefined));
  }
}
