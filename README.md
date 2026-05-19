# Sortify

Repozytorium zawiera materiały do pracy magisterskiej oraz dwa porównywane projekty frontendowe: aplikację w React i aplikację w Angularze. Obie implementacje rozwiązują ten sam problem: wizualizację algorytmów sortowania w kontrolowanych, deterministycznych warunkach, tak aby można było porównywać zachowanie frameworków przy intensywnych aktualizacjach interfejsu.

## Zawartość repozytorium

- `apps/react` – wersja Sortify zbudowana w React 19 i React Router 7
- `apps/angular` – wersja Sortify zbudowana w Angular 21
- `apps/thesis` – źródła pracy magisterskiej w LaTeX

## Co potrafią aplikacje

Obie aplikacje są obecnie ujednolicone pod kątem najważniejszych założeń eksperymentu:

- wspólny zestaw algorytmów: Bubble Sort, Quick Sort, Merge Sort, Insertion Sort,
- deterministyczne dane wejściowe oparte o wspólny seed,
- wybór wzorca danych wejściowych: `Random`, `Sorted`, `Reverse Sorted`, `Many Duplicates`,
- regulacja prędkości animacji w zakresie `1–1000 ms`,
- wybór rozmiaru zbioru danych z poziomu interfejsu,
- równoległe porównanie czterech przebiegów na dashboardzie,
- preview algorytmów na landing page,
- własny renderer słupków oparty o proste elementy DOM, bez zewnętrznej biblioteki wykresów.

## Struktura workspace

Repozytorium działa jako monorepo `pnpm` z wykorzystaniem `turbo`.

```text
.
├── apps/
│   ├── angular/
│   ├── react/
│   └── thesis/
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

## Wymagania

Do pracy z repozytorium potrzebne są:

- `Node.js` w aktualnej wersji LTS,
- `pnpm`,
- kompletne środowisko LaTeX z `xelatex` i `latexmk`, jeśli chcesz budować PDF pracy.

## Instalacja

```bash
pnpm install
```

## Najważniejsze komendy

Z poziomu katalogu głównego:

```bash
# uruchomienie obu aplikacji równolegle
pnpm dev

# uruchomienie tylko React
pnpm dev:react

# uruchomienie tylko Angular
pnpm dev:angular

# build całego monorepo
pnpm build

# build pracy magisterskiej
pnpm build:thesis
```

## Uruchamianie poszczególnych części

### React

```bash
pnpm dev:react
pnpm --filter @sortify/react build
```

Stack technologiczny:

- React 19
- React Router 7
- TypeScript
- Vite
- Tailwind CSS v4

### Angular

```bash
pnpm dev:angular
pnpm --filter @sortify/angular build
```

Stack technologiczny:

- Angular 21
- Angular Router
- Angular Signals
- TypeScript
- SCSS
- Tailwind CSS v4

### Praca magisterska

```bash
pnpm build:thesis
```

PDF jest generowany w katalogu `apps/thesis/dist`.

## Cel repozytorium

Repozytorium nie jest zwykłym zbiorem dwóch niezależnych demo-aplikacji. Jego celem jest utrzymanie możliwie porównywalnych implementacji tego samego problemu w dwóch frameworkach oraz równoległe dokumentowanie tych decyzji w pracy magisterskiej. Z tego względu wiele decyzji architektonicznych jest świadomie konserwatywnych: mniej chodzi tu o maksymalną rozbudowę funkcji, a bardziej o kontrolę zmiennych wpływających na interpretację zachowania aplikacji.
