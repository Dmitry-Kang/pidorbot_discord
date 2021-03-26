# pidorbot_discord
* Чтобы он заработал, нужно в папке проекта в файле .env добавили данные для работы бота:

# Пример содержания файла .env:
## Начало
DISCORD_TOKEN=abcabc # Токен дискорд бота

# если нету DATABASE_URL
# POSTGRES_DB=abcabc
# POSTGRES_PASSWORD=abcabc

# если есть DATABASE_URL
# DATABASE_URL=abcabc  
## Конец
# Теперь про файл docker-compose.yml
* Проверьте поле с POSTGRES_DB и POSTGRES_PASSWORD, установите свои значения
* Убедитесь, что эти поля совпадают с такимиже полями в файле .env
