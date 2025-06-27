FROM php:8.1-fpm
RUN apt-get update && apt-get install -y libpng-dev libonig-dev libxml2-dev zip unzip git curl
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
WORKDIR /var/www
COPY backend/ .
RUN composer install --no-scripts --no-interaction
RUN chmod -R 775 storage bootstrap/cache
RUN chown -R www-data:www-data /var/www
COPY backend/.env.example .env
RUN php artisan key:generate
EXPOSE 9000
CMD ["php-fpm"]