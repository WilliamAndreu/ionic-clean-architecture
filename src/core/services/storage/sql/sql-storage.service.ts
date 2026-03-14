import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { StorageSource } from '../source/storage-source.interface';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';

@Injectable({
  providedIn: 'root',
})
export class SQLStorageService extends StorageSource {
  private readonly DB_NAME = 'storage_db';
  private readonly TABLE_NAME = 'key_value_store';
  private sqliteConnection: SQLiteConnection;
  private db: SQLiteDBConnection | null = null;
  private isInitialized = false;

  constructor() {
    super();
    this.sqliteConnection = new SQLiteConnection(CapacitorSQLite);
  }

  private initializeDB(): Observable<void> {
    if (this.isInitialized && this.db) {
      return of(void 0);
    }

    return from(
      this.sqliteConnection
        .createConnection(this.DB_NAME, false, 'no-encryption', 1, false)
        .then(async (db) => {
          this.db = db;
          await this.db.open();
          await this.db.execute(`
            CREATE TABLE IF NOT EXISTS ${this.TABLE_NAME} (
              key TEXT PRIMARY KEY NOT NULL,
              value TEXT NOT NULL
            );
          `);
          this.isInitialized = true;
        }),
    );
  }

  override get<T>(key: string): Observable<T | null> {
    return this.initializeDB().pipe(
      switchMap(() =>
        from(
          this.db!.query(`SELECT value FROM ${this.TABLE_NAME} WHERE key = ?`, [key]).then(
            (result) => {
              if (result.values && result.values.length > 0) {
                try {
                  return JSON.parse(result.values[0].value) as T;
                } catch {
                  return null;
                }
              }
              return null;
            },
          ),
        ),
      ),
      catchError(() => of(null)),
    );
  }

  override set<T>(key: string, value: T): Observable<void> {
    return this.initializeDB().pipe(
      switchMap(() =>
        from(
          this.db!.run(`INSERT OR REPLACE INTO ${this.TABLE_NAME} (key, value) VALUES (?, ?)`, [
            key,
            JSON.stringify(value),
          ]).then(() => void 0),
        ),
      ),
    );
  }

  override remove(key: string): Observable<void> {
    return this.initializeDB().pipe(
      switchMap(() =>
        from(
          this.db!.run(`DELETE FROM ${this.TABLE_NAME} WHERE key = ?`, [key]).then(() => void 0),
        ),
      ),
    );
  }

  override clear(): Observable<void> {
    return this.initializeDB().pipe(
      switchMap(() => from(this.db!.run(`DELETE FROM ${this.TABLE_NAME}`, []).then(() => void 0))),
    );
  }

  override has(key: string): Observable<boolean> {
    return this.initializeDB().pipe(
      switchMap(() =>
        from(
          this.db!.query(`SELECT COUNT(*) as count FROM ${this.TABLE_NAME} WHERE key = ?`, [
            key,
          ]).then((result) => {
            return !!(result.values && result.values.length > 0 && result.values[0].count > 0);
          }),
        ),
      ),
      catchError(() => of(false)),
    );
  }
}
