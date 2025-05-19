# Movie Explorer

Aplikacja do wyszukiwania filmów z wykorzystaniem API OMDB. Projekt został stworzony w React z TypeScript, wykorzystując nowoczesne praktyki programistyczne i responsywny design.

## Funkcjonalności

- 🔍 Wyszukiwanie filmów po tytule
- 🎬 Wyświetlanie szczegółowych informacji o filmach
- ⭐ System ulubionych filmów
- 🌓 Tryb jasny/ciemny
- 🔄 Cachowanie wyników wyszukiwania
- ⏱️ Debouncing wyszukiwania
- 🎨 Nowoczesny i intuicyjny interfejs

## Struktura projektu

```
src/
├── assets/          # Obrazy i ikony
├── context/         # Konteksty React (Theme, Favorites)
├── hooks/           # Własne hooki
├── pages/          # Komponenty stron
├── styles/         # Style globalne i mixiny
└── config.ts       # Konfiguracja aplikacji
```

## Instalacja

1. Sklonuj repozytorium:
```bash
git clone [url-repozytorium]
```

2. Zainstaluj zależności:
```bash
npm install
```

3. Uruchom aplikację:
```bash
npm start
```

## Użycie

1. Na stronie głównej wpisz tytuł filmu w pole wyszukiwania
2. Poczekaj na wyniki
3. Przeglądaj wyniki wyszukiwania
5. Dodawaj filmy do ulubionych
6. Usuwaj filmy z ulubionych
7. Przełączaj między trybem jasnym i ciemnym

## Optymalizacje

- Cachowanie wyników wyszukiwania w localStorage
- Debouncing zapytań do API
- Responsywny design z breakpointami

## Autor

Jakub Makowski
