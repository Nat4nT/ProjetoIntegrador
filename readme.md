# Como Rodar o  projeto?

Após clonar o projeto é necessario seguir os seguintes passos

## Etapa 1 - Backend
### Configuração
  Altere o arquivo .env.exemple com os dados desejado e após isso, renomeie para .env
### Subir o docker
Caso esteja utilizando Windows como sistema operacional é necessario iniciar o docker desktop para realizar o comando a seguir.

````bash
  docker compose up --build -d
````
## Etapa 2 - Criação de tabelas e população de dados pré definidos

````` bash
docker exec -it medihub bash -c "php vendor/bin/phinx migrate -e development --configuration=/var/www/html/phinx.php && php vendor/bin/phinx seed:run -e development --configuration=/var/www/html/phinx.php"
 
``````
caso o modo 1 de popular o banco exiba algum erro , recomendamos seguir os seguintes passos

````` bash
cd /backend
docker exec -it medihub bash
php vendor/bin/phinx migrate -e development --configuration=/var/www/html/phinx.php
php vendor/bin/phinx seed:run -e development --configuration=/var/www/html/phinx.php
``````

## Etapa 2 - Frontend

Este repositório contém o frontend do **MedExame**, criado com **React + TypeScript** e empacotado com **Vite**.

## Requisitos de ambiente

- **Node.js**: **>= 18** (recomendado **Node 20 LTS**)
- **npm**: **>= 9** (vem com o Node LTS)
- Sistema operacional: Windows, macOS ou Linux

Gerenciador de pacotes: **npm** 

### (Opcional) Selecionar a versão do Node com nvm
```bash
nvm install 20
nvm use 20
```

###  Instalar as dependências (deve estar dentro da pasta frontend para rodar o comando)
```bash
npm install
```

### 4- Rodar em modo desenvolvimento (HMR) (deve estar dentro da pasta frontend para rodar o comando)
```bash
npm run dev
```
- O Vite exibirá uma URL local (ex.: `http://localhost:5173`). Acesse no navegador.





