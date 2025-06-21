## Описание

Сервис выполняет:
- регулярную загрузку тарифов WB (https://common-api.wildberries.ru/api/v1/tariffs/box)
- сохранение тарифов в PostgreSQL
- экспорт актуальных тарифов в Google Sheets

## Подготовка к запуску

Перед запуском необходимо выполнить следующие шаги:

### 1. Создать .env файл в корне проекта на основе example.env

### 2. Добавить Google credentials

- Создайте сервисный аккаунт в Google Cloud Console
- Включите Google Sheets API
- Скачайте credentials JSON-файл и сохраните его в:  
  `src/config/google/credentials.json`
- Выдайте доступ на редактирование нужной Google-таблицы сервисному аккаунту


## Запуск проекта

Выполните команду:

```
docker compose up --build
```

Откроется два контейнера:
- `postgres` — база данных
- `app` — Node.js приложение

### Выполнение миграций (один раз)

После старта контейнеров:

```
docker compose exec app npx knex migrate:latest
```

### Запуск seed (один раз)

```
docker compose exec app npx knex seed:run
```

## Проверка работы

- В логе контейнера `app` вы должны увидеть сообщения о синхронизации тарифов и их экспорте.
- В таблице `tariffs` появятся актуальные записи
- В указанной Google таблице на листе `stocks_coefs` появятся данные, отсортированные по коэффициенту

## Структура

- `src/services/` — логика загрузки, сохранения, экспорта
- `src/scheduler/` — cron-задача
- `src/postgres/` — миграции, модели, knex
- `compose.yaml`, `Dockerfile` — инфраструктура