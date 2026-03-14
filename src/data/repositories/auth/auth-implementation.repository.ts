import { inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthRepository } from '@repositories/auth/auth.repository';
import { AuthRemoteDataSource } from '@data/datasource/auth/source/auth-remote.datasource';
import { AuthLocalDataSource } from '@data/datasource/auth/source/auth-local.datasource';
import { LoginDtoToEntityMapper, UserDtoToEntityMapper } from './mappers/auth-dto-to-entity.mapper';
import { TokensDboToEntityMapper } from './mappers/auth-dbo-to-entity.mapper';
import { LoginEntity, TokensEntity, UserEntity } from '@models/auth/auth-entity.model';
import { NetworkError, ServerError } from 'src/core/errors/app-error';
import { InvalidCredentialsError, SessionExpiredError } from 'src/domain/errors/auth/auth.errors';

@Injectable()
export class AuthImpRepository extends AuthRepository {
  private readonly remote = inject(AuthRemoteDataSource);
  private readonly local = inject(AuthLocalDataSource);
  private readonly loginMapper = inject(LoginDtoToEntityMapper);
  private readonly userMapper = inject(UserDtoToEntityMapper);
  private readonly tokensDboMapper = inject(TokensDboToEntityMapper);

  override login(username: string, password: string): Observable<LoginEntity> {
    return this.remote.login(username, password).pipe(
      map((dto) => this.loginMapper.mapFrom(dto)),
      switchMap((entity) =>
        this.local
          .saveTokens(
            this.tokensDboMapper.mapTo({
              accessToken: entity.accessToken,
              refreshToken: entity.refreshToken,
            }),
          )
          .pipe(map(() => entity)),
      ),
      catchError((err: unknown) => {
        if (err instanceof HttpErrorResponse)
          switch (err.status) {
            case 401:
              return throwError(
                () => new InvalidCredentialsError('errors.auth.invalid_credentials'),
              );
            case 0:
              return throwError(() => new NetworkError('errors.network'));
          }
        return throwError(() => new ServerError('errors.server'));
      }),
    );
  }

  override getAuthUser(): Observable<UserEntity> {
    return this.remote.getAuthUser().pipe(
      map((dto) => this.userMapper.mapFrom(dto)),
      catchError((err: unknown) => {
        if (err instanceof HttpErrorResponse)
          switch (err.status) {
            case 401:
              return throwError(() => new SessionExpiredError('errors.auth.session_expired'));
            case 0:
              return throwError(() => new NetworkError('errors.network'));
          }
        return throwError(() => new ServerError('errors.server'));
      }),
    );
  }

  override refreshToken(): Observable<TokensEntity> {
    return this.local.getRefreshToken().pipe(
      switchMap((token) => {
        if (!token) return throwError(() => new SessionExpiredError('errors.auth.session_expired'));
        return this.remote.refreshToken(token).pipe(
          map((dto) =>
            this.tokensDboMapper.mapFrom({
              accessToken: dto.accessToken,
              refreshToken: dto.refreshToken,
            }),
          ),
          switchMap((entity) =>
            this.local.saveTokens(this.tokensDboMapper.mapTo(entity)).pipe(map(() => entity)),
          ),
          catchError((err: unknown) => {
            if (err instanceof HttpErrorResponse)
              switch (err.status) {
                case 401:
                  return throwError(() => new SessionExpiredError('errors.auth.session_expired'));
                case 0:
                  return throwError(() => new NetworkError('errors.network'));
              }
            return throwError(() => new ServerError('errors.server'));
          }),
        );
      }),
    );
  }
}
