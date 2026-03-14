import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { StorageSource } from '../source/storage-source.interface';

@Injectable()
export class LocalStorageService extends StorageSource {
  override get<T>(key: string): Observable<T | null> {
    return of(this.getSync<T>(key));
  }

  override set<T>(key: string, value: T): Observable<void> {
    return from(
      Promise.resolve().then(() => {
        localStorage.setItem(key, JSON.stringify(value));
      }),
    );
  }

  override remove(key: string): Observable<void> {
    return from(
      Promise.resolve().then(() => {
        localStorage.removeItem(key);
      }),
    );
  }

  override clear(): Observable<void> {
    return from(
      Promise.resolve().then(() => {
        localStorage.clear();
      }),
    );
  }

  override has(key: string): Observable<boolean> {
    return of(localStorage.getItem(key) !== null);
  }

  private getSync<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    if (item === null) {
      return null;
    }
    try {
      return JSON.parse(item) as T;
    } catch {
      return null;
    }
  }
}
