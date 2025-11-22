FROM php:8.3-apache

RUN a2enmod rewrite

RUN docker-php-ext-install pdo pdo_mysql

COPY backend /var/www/html/

RUN chown -R www-data:www-data /var/www/html

EXPOSE 80

CMD ["apache2-foreground"]