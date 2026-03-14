# Changelog

All notable changes to this project will be documented in this file.
Format based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

---

## [2.0.0] — 2026-03-13

Full rewrite of the architecture template. Migrated from the original Ionic scaffold to a production-ready Clean Architecture + MVVM system with Products + Auth via DummyJSON API.

### Added
- **`justfile`** — centralizes project commands: `just setup`, `just test`, `just coverage`, `just lint`, `just format`, `just sync`, `just android`, `just ios`, `just add-android`, `just add-ios`
- **`.nvmrc`** — pins Node.js version to `25.6.1`
- **Observable-based `StorageSource`** — abstract class with `get<T>()`, `set()`, `remove()` returning `Observable<T>`. Critical for Capacitor SQLite compatibility; all storage operations are async by contract
- **`CapacitorStorageService`** — concrete implementation of `StorageSource` using `@capacitor/preferences`
- **Products feature** — list with search + infinite scroll (via `IonInfiniteScroll`), product detail view
- **Auth feature** — login, profile (`UserDetailView`), `authGuard`, `guestGuard`, token refresh
- **Domain layer** — `ProductEntity`, `ProductsEntity`, `LoginEntity`, `UserEntity`, `TokensEntity`; abstract `ProductsRepository` and `AuthRepository`; `GetProductsUseCase`, `GetProductUseCase`, `LoginUseCase`, `GetAuthUserUseCase`, `RefreshTokenUseCase`
- **Data layer** — DTOs (`ProductDto`, `ProductsDto`), DBOs (`ProductsDbo`, `AuthDbo`, `TokensDbo`) with `cachedAt` TTL field, remote/local datasource implementations, `ProductDtoToEntityMapper`, `ProductDboToEntityMapper`, `LoginDtoToEntityMapper`, `TokensDboToEntityMapper`
- **DI per route** — `provideProductsDI()`, `provideAuthDI()` via `makeEnvironmentProviders()`, scoped to route providers
- **Private/Public layouts** with `IonRouterOutlet` and lazy-loaded route groups
- **`IonInfiniteScroll`** + `@ViewChild` + `effect()` pattern — replaces `IntersectionObserver` sentinel for infinite scroll in Ionic's scroll model
- **`switchMap` storage chains** — `AuthImpRepository.login()` and `refreshToken()` use `switchMap` to properly sequence Observable storage writes after HTTP calls
- **`forkJoin`** — parallel token writes in `AuthLocalDataSourceImp.saveTokens()` and `clearTokens()`
- **`DetailHeader`** — shared reusable component with `input()` signals and `RouterLink`
- **`ImgFallbackDirective`** — replaces broken images with transparent 1×1 gif placeholder
- **`PricePipe`** — formats number as `$0.00`
- **`calcOriginalPrice`** util — derives pre-discount price from discounted price + percentage
- **Three-layer error hierarchy** — core errors (`AppError`, `NetworkError`, `UnauthorizedError`, `NotFoundError`, `ServerError`) in `src/core/errors/`; domain errors (`InvalidCredentialsError`, `SessionExpiredError`) in `src/domain/errors/auth/`; `ProductNotFoundError` in `src/domain/errors/products/`. Repositories map HTTP status codes to domain errors via `catchError` + `switch (err.status)`. ViewModels read `err.messageKey` directly
- **i18n** — `@ngx-translate/core`; translation file at `src/core/assets/i18n/en.json`; ViewModels store keys, never translated strings
- **Full test suite** — 12 Vitest spec files, 46 tests across all layers: core (pipes, utils, directives, errors), data (mapper, cache, repository), domain (usecases), presentation (viewmodels)
- **`coverage` build configuration** in `angular.json` — enables `ng test --configuration coverage` for the `@angular/build:unit-test` runner
- **Path aliases** — `@models/*`, `@usecases/*`, `@repositories/*`, `@data/*`, `@views/*`, `@pipes/*`, `@directives/*`, `@guards/*`, `@interceptors/*`

### Changed
- **DummyJSON API** (`https://dummyjson.com`) replaces the Rick & Morty API
- **Login form** — migrated to Angular Reactive Forms with `FormBuilder.nonNullable.group()`; all controls typed as `string` (non-nullable), submit guarded by `form.invalid`
- **`app.component.ts`** simplified — no constructor, uses `IonApp` + `IonRouterOutlet` standalone imports
- **`justfile` coverage recipe** — `npm test -- --coverage` replaced with `npm test -- --configuration coverage` (Angular 20 `@angular/build:unit-test` does not accept `--coverage` as a CLI flag)
- **`products-list-view.html`** — `<app-products-header>` moved inside `<ion-content>` so that `position: sticky` + `backdrop-filter` work correctly against Ionic's internal scroll container

### Removed
- **`just start`** — removed as redundant; use `npm start` directly
- **Characters feature** (`characters-list-view`, character entities, repository, usecases, datasources) — replaced by Products + Auth
- **`FilterCharactersByNamePipe`** and **`AuthImagePipe`** — replaced by `PricePipe`
- **`check-empty-object` util** — unused
- **`src/core/public-interface/`** — unused
- **`src/presentation/shared-components/`** — replaced by `src/presentation/shared/components/`

---

## [1.0.0] — 2025-01-01

### Added
- Initial Ionic + Angular scaffold with NgModule-based architecture
- **Rick & Morty API** integration (`https://rickandmortyapi.com/api/`)
- **Characters feature** — paginated list with infinite scroll
- **`FilterCharactersByNamePipe`** — client-side character name filter
- **`AuthImagePipe`** — secure image loading with Bearer token
- **Local datasource** with DBO model for character caching
- **`check-empty-object`** utility
- Capacitor 7 integration for Android / iOS builds
- ESLint + Prettier configuration
