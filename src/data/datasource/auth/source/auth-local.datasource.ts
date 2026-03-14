import { Observable } from 'rxjs';
import { TokensDbo } from '../local/dbo/auth.dbo';

// Ionic: all methods return Observable to support async storage (e.g. Capacitor SQLite)
export abstract class AuthLocalDataSource {
  abstract saveTokens(tokens: TokensDbo): Observable<void>;
  abstract getAccessToken(): Observable<string | null>;
  abstract getRefreshToken(): Observable<string | null>;
  abstract clearTokens(): Observable<void>;
}
