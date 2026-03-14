import { Observable } from 'rxjs';

export abstract class StorageSource {
  abstract get<T>(key: string): Observable<T | null>;
  abstract set<T>(key: string, value: T): Observable<void>;
  abstract remove(key: string): Observable<void>;
  abstract clear(): Observable<void>;
  abstract has(key: string): Observable<boolean>;
}
