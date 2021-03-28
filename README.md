# pidorbot_discord
## Установка
1) npm i
2) В папке проекта в файле .env добавили данные для работы бота:
### Пример содержания файла .env:
```
DISCORD_TOKEN=abcabc # Токен дискорд бота

# если нету DATABASE_URL
# POSTGRES_DB=abcabc
# POSTGRES_PASSWORD=abcabc

# если есть DATABASE_URL
# DATABASE_URL=abcabc  
```
3) настроить docker-compose.yml
### docker-compose.yml
* Проверьте поле с POSTGRES_DB и POSTGRES_PASSWORD, установите свои значения
* Убедитесь, что эти поля совпадают с такимиже полями в файле .env

## Запуск
* В папке проекта:
* docker-compose up -d (чтобы выключить docker-compose down)
* node index.js
