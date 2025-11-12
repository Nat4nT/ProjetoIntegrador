levantar ambiente
docker compose up --build

criar bancos :
docker exec -it medihub bash -c "vendor/bin/phinx migrate -e development && vendor/bin/phinx seed:run -e development"


