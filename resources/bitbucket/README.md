# Ionic Clean Architecture

**A production-ready Clean Architecture + MVVM template for Ionic / Capacitor**

Built with Angular signals, zoneless change detection, standalone components, and Observable-based storage for Capacitor SQLite compatibility.

[![Ionic](https://img.shields.io/badge/Ionic-8.8-3880FF?style=for-the-badge&logo=ionic&logoColor=white)](https://ionicframework.com)
[![Angular](https://img.shields.io/badge/Angular-20.0-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.dev)
[![Capacitor](https://img.shields.io/badge/Capacitor-7.4-119EFF?style=for-the-badge&logo=capacitor&logoColor=white)](https://capacitorjs.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![RxJS](https://img.shields.io/badge/RxJS-7.8-B7178C?style=for-the-badge&logo=reactivex&logoColor=white)](https://rxjs.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.2-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vitest](https://img.shields.io/badge/Vitest-3.1-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev)
[![Node.js](https://img.shields.io/badge/Node.js-25.6.1-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)

---

## Quick Start

Requires [just](https://github.com/casey/just) and [nvm](https://github.com/nvm-sh/nvm).

```bash
just setup    # nvm use + npm install (configures husky automatically)
npm start     # Dev server → http://localhost:8100
```

---

## Architecture

The project enforces a strict **dependency rule**: outer layers depend on inner layers, never the reverse.

```
╔═══════════════════════════════════════════════════════════════╗
║                       PRESENTATION                            ║
║     Ionic Components  ·  ViewModels  ·  Signals State         ║
╠═══════════════════════════════════════════════════════════════╣
║                         DOMAIN                                ║
║       Entities  ·  Repositories (abstract)  ·  UseCases       ║
╠═══════════════════════════════════════════════════════════════╣
║                          DATA                                 ║
║       Repositories (impl)  ·  DataSources  ·  Mappers         ║
╠═══════════════════════════════════════════════════════════════╣
║                          CORE                                 ║
║        Interfaces  ·  Utils  ·  Interceptors  ·  Errors       ║
╚═══════════════════════════════════════════════════════════════╝
                  dependency arrow points inward ↑
```

### Folder Structure

```
src/
├── core/                          # Framework-agnostic utilities
│   ├── assets/                    # Static assets (i18n, icons…)
│   │   └── i18n/en.json
│   ├── core-interface/            # UseCase, Mapper, ViewState interfaces
│   ├── directives/                # ImgFallbackDirective
│   ├── environments/              # environment.ts / environment.prod.ts
│   ├── errors/                    # AppError, NetworkError, UnauthorizedError…
│   ├── guards/                    # AuthGuard, GuestGuard
│   ├── interceptors/              # publicInterceptor, authInterceptor
│   ├── pipes/                     # PricePipe
│   ├── services/storage/          # StorageSource (abstract, Observable) + CapacitorStorageService
│   └── utils/                     # calcOriginalPrice
│
├── data/                          # Infrastructure layer
│   ├── datasource/
│   │   ├── products/
│   │   │   ├── remote/
│   │   │   │   ├── dto/           # ProductDto, ProductsDto  (API models)
│   │   │   │   └── products-remote.datasource.imp.ts
│   │   │   ├── local/
│   │   │   │   ├── dbo/           # ProductDbo, ProductsDbo  (local storage models)
│   │   │   │   └── products-local.datasource.imp.ts
│   │   │   └── source/            # Abstract datasource contracts
│   │   └── auth/                  # Same structure (remote/dto, local/dbo)
│   ├── repositories/
│   │   ├── products/
│   │   │   ├── mappers/           # ProductDtoToEntityMapper, ProductDboToEntityMapper
│   │   │   └── products-implementation.repository.ts
│   │   └── auth/
│   │       ├── mappers/           # LoginDtoToEntityMapper, TokensDboToEntityMapper
│   │       └── auth-implementation.repository.ts
│   └── di/                        # provideProductsDI(), provideAuthDI()
│
├── domain/                        # Business rules — zero framework dependencies
│   ├── entities/                  # ProductEntity, UserEntity, LoginEntity…
│   ├── errors/                    # Domain-specific errors per feature
│   │   ├── auth/                  # InvalidCredentialsError, SessionExpiredError
│   │   └── products/              # ProductNotFoundError
│   ├── repositories/              # Abstract repository contracts
│   └── usecases/                  # GetProductsUseCase, LoginUseCase…
│
├── presentation/                  # UI layer
│   ├── app/
│   │   ├── views/
│   │   │   ├── products-list-view/
│   │   │   │   ├── components/    # ProductCard, ProductsGrid, ProductsHeader…
│   │   │   │   └── viewmodel/     # products.state.ts, products.viewmodel.ts
│   │   │   ├── product-detail-view/
│   │   │   │   ├── components/    # ProductGallery, ProductInfo…
│   │   │   │   └── viewmodel/
│   │   │   ├── user-detail-view/
│   │   │   │   ├── components/    # UserProfileCard…
│   │   │   │   └── viewmodel/
│   │   │   └── login-view/
│   │   │       ├── components/    # LoginForm, LoginHeader, LoginFooter
│   │   │       └── viewmodel/
│   │   ├── layouts/               # PublicLayout, PrivateLayout (IonRouterOutlet)
│   │   ├── app.config.ts          # Root providers (DI, router, i18n, Ionic)
│   │   └── app.routes.ts
│   └── shared/
│       └── components/            # DetailHeader (reusable across views)
│
└── tests/                         # Mirrors src/ structure
    ├── core/
    ├── data/
    ├── domain/
    └── presentation/
```

---

## Key Patterns

### Observable-based storage (Capacitor SQLite compatible)

All `StorageSource` methods return `Observable<T>` — the critical difference from a standard Angular app. Synchronous storage would not be compatible with Capacitor SQLite or other async native storage plugins.

```ts
abstract class StorageSource {
  abstract get<T>(key: string): Observable<T | null>;
  abstract set<T>(key: string, value: T): Observable<void>;
  abstract remove(key: string): Observable<void>;
}
```

Repository implementations chain storage operations with `switchMap`:

```ts
override login(username: string, password: string): Observable<LoginEntity> {
  return this.remote.login(username, password).pipe(
    map((dto) => this.loginMapper.mapFrom(dto)),
    switchMap((entity) =>
      this.local.saveTokens(tokensDbo).pipe(map(() => entity)),
    ),
  );
}
```

### Ionic infinite scroll with Signals

Replaces `IntersectionObserver` + sentinel with `IonInfiniteScroll` + `@ViewChild` + `effect()`:

```ts
@ViewChild(IonInfiniteScroll) private readonly infiniteScroll?: IonInfiniteScroll;

constructor() {
  effect(() => {
    if (!this.vm.viewState.isLoading()) {
      this.infiniteScroll?.complete();
    }
  });
}
```

### DTO / DBO separation

```
Remote datasource  →  DTO  →  DtoToEntityMapper  →  Entity
Local datasource   →  DBO  →  DboToEntityMapper  →  Entity
```

- **DTO** (`remote/dto/`) — mirrors the API response shape
- **DBO** (`local/dbo/`) — models what is persisted in local storage (includes `cachedAt`)

### Cache with TTL

```ts
// save (fire-and-forget)
saveProducts(skip: number, data: ProductsDbo): void {
  this.storage.set(this.cacheKey(skip), data).subscribe();
}

// read — returns null if stale
getProducts(skip: number): Observable<ProductsDbo | null> {
  return this.storage.get<ProductsDbo>(this.cacheKey(skip)).pipe(
    map((cached) => {
      if (!cached) return null;
      if (Date.now() - cached.cachedAt > PRODUCTS_CACHE_TTL_MS) return null;
      return cached;
    }),
  );
}
```

### Typed error handling

Errors flow through three layers, each adding more specificity:

```
HTTP response
    ↓  publicInterceptor: maps HTTP status → core AppError
Core error  (NetworkError, BadRequestError, UnauthorizedError…)
    ↓  repository: catchError + instanceof checks → domain error
Domain error  (InvalidCredentialsError, ProductNotFoundError…)
    ↓  usecase: passes AppError through, generic fallback otherwise
ViewModel: err instanceof AppError ? err.messageKey : 'errors.unknown'
    ↓
{{ error() | translate }}
```

**Core errors** — generic infrastructure (`src/core/errors/`):

| Class | HTTP Status | i18n Key |
|---|:---:|---|
| `NetworkError` | `0` | `errors.network` |
| `BadRequestError` | `400` | `errors.unknown` |
| `UnauthorizedError` | `401` | `errors.unauthorized` |
| `NotFoundError` | `404` | `errors.not_found` |
| `ServerError` | `5xx` | `errors.server` |

**Domain errors** — business-specific (`src/domain/errors/`):

| Class | Extends | i18n Key |
|---|---|---|
| `InvalidCredentialsError` | `UnauthorizedError` | `errors.auth.invalid_credentials` |
| `SessionExpiredError` | `UnauthorizedError` | `errors.auth.session_expired` |
| `ProductNotFoundError` | `NotFoundError` | `errors.products.not_found` |

`publicInterceptor` converts every `HttpErrorResponse` into a typed `AppError` before it reaches the repository. Repositories then check `instanceof` to map core errors to domain-specific ones. ViewModels read `err.messageKey` directly — no mapping needed at the presentation layer.

### i18n

Translation keys live in `src/core/assets/i18n/en.json`. Templates use `| translate`. ViewModels always store the **key**, never the translated string.

---

## Testing

```bash
just test                       # Run all tests
just coverage                   # With coverage report
open coverage/index.html        # Open HTML coverage report
```

Tests use **Vitest** (no Jest, no Karma). Pure logic runs without Angular TestBed.

---

## Commands

| Command | Description |
|---|---|
| `just setup` | Set Node version via nvm + install dependencies |
| `npm start` | Dev server at `localhost:8100` |
| `just test` | Run all tests |
| `just coverage` | Run tests with coverage report |
| `just lint` | ESLint |
| `just lint-fix` | ESLint (auto-fix) |
| `just format` | Prettier (write) |
| `npm run build` | Production web build |
| `just sync` | Build web + sync to native projects |
| `just add-android` | Create Android project (first time only) |
| `just add-ios` | Create iOS project (first time only) |
| `just android` | Sync + open Android Studio |
| `just ios` | Sync + open Xcode |

---

## Quality

- **ESLint** — enforces `prefer-standalone` and `prefer-inject` as errors, `no-explicit-any` as error
- **Prettier** — auto-formats on commit via lint-staged
- **Husky** — pre-commit hook runs lint-staged automatically after `just setup`
- **lint-staged** — only lints/formats staged files, not the whole project
