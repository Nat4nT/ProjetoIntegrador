levantar ambiente
docker compose up --build -d

criar bancos :
docker exec -it medihub bash -c "vendor/bin/phinx migrate -e development && vendor/bin/phinx seed:run -e development"


docker exec -it medihub bash -c "php vendor/bin/phinx migrate -e development --configuration=/var/www/html/phinx.php && php vendor/bin/phinx seed:run -e development --configuration=/var/www/html/phinx.php"
