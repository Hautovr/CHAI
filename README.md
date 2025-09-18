# ЧайСчитай — Telegram Mini App (React + Vite)

Мини-приложение для учёта чаевых. Оффлайн-first, IndexedDB (Dexie), Zustand.

## Локальный запуск

1) Установите Node 18+.
2) Установите зависимости:
```bash
npm install
```
3) Запуск dev-сервера:
```bash
npm run dev
```

Откройте `http://localhost:5173`.

## Билд
```bash
npm run build
npm run preview
```

## Интеграция с Telegram WebApp

- В коде подключён `@twa-dev/sdk` и базовая инициализация в `src/lib/telegram.ts`.
- Задеплойте `dist` на хостинг (Cloudflare Pages, Netlify, Vercel). Возьмите публичный HTTPS URL.
- В `@BotFather` создайте бота и включите WebApp кнопку:
  - /newbot → получите токен
  - /setdomain → ваш HTTPS домен
  - /setmenubutton → Web App URL на ваш домен
- В Telegram откройте чат с ботом → Меню → откроется Mini App.

initDataUnsafe используется только для UX (имя/аватар) и темы. Критичные решения на нём не основаны.

## Структура
```
src/
  app.tsx
  main.tsx
  index.css
  lib/
    telegram.ts
    i18n.ts
  store/
    tips.store.ts
    shifts.store.ts
    settings.store.ts
  db/
    dexie.ts
    models.ts
  components/
    Header.tsx
    Numpad.tsx
    QuickAmounts.tsx
    TipForm.tsx
    TipListItem.tsx
    EmptyState.tsx
  pages/
    Home.tsx
    History.tsx
    Stats.tsx
    Settings.tsx
    Shifts.tsx
  utils/
    rounding.ts
    date.ts
    csv.ts
  services/
    sync.ts
```

## Тесты
```bash
npm run test
```

Покрыты: округление, стор чаевых (базовые сценарии).

## Замечания
- Тема наследуется из Telegram themeParams и пробрасывается в CSS-переменные.
- Архитектура расширяема: слой `services/sync.ts` — заглушки под будущую синхронизацию.
- Для продакшена добавьте PWA-манифест и иконки (по желанию).