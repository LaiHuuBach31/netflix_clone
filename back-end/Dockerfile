# FROM php:8.3-fpm-alpine

# RUN apk add --no-cache \
#     bash curl git unzip libzip-dev libpng-dev libjpeg-turbo-dev freetype-dev \
#     libxml2-dev oniguruma-dev zlib-dev libjpeg-turbo libpng libwebp-dev libxpm-dev \
#     && docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
#     && docker-php-ext-install pdo_mysql mbstring zip exif pcntl bcmath gd

# COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# WORKDIR /var/www
# COPY . .

# RUN composer install --no-interaction --prefer-dist --optimize-autoloader

# RUN chmod -R 775 storage bootstrap/cache && \
#     chown -R www-data:www-data /var/www

# EXPOSE 9000
# CMD ["php-fpm"]

FROM php:8.3-fpm-alpine

RUN apk add --no-cache \
    bash curl git unzip libzip-dev libpng-dev libjpeg-turbo-dev freetype-dev \
    libxml2-dev oniguruma-dev zlib-dev libjpeg-turbo libpng libwebp-dev libxpm-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
    && docker-php-ext-install pdo_mysql mbstring zip exif pcntl bcmath gd

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www
COPY . .

RUN composer install --no-interaction --prefer-dist --optimize-autoloader

RUN chmod -R 775 storage bootstrap/cache && \
    chown -R www-data:www-data /var/www

EXPOSE 9000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=9000"]

