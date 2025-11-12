# MedExame — Guia de Execução do Projeto (Frontend)

Este repositório contém o frontend do **MedExame**, criado com **React + TypeScript** e empacotado com **Vite**.

## Requisitos de ambiente

- **Node.js**: **>= 18** (recomendado **Node 20 LTS**)
- **npm**: **>= 9** (vem com o Node LTS)
- Sistema operacional: Windows, macOS ou Linux

Gerenciador de pacotes: **npm** 

## Como rodar o projeto

### 1- Clonar e entrar na pasta
```bash
git clone <URL_DO_REPOSITORIO>
cd ProjetoIntegrador/medExame
```

### 2- (Opcional) Selecionar a versão do Node com nvm
```bash
nvm install 20
nvm use 20
```

### 3- Instalar as dependências
```bash
npm install
```

### 4- Rodar em modo desenvolvimento (HMR)
```bash
npm run dev
```
- O Vite exibirá uma URL local (ex.: `http://localhost:5173`). Acesse no navegador.


### PARA SUBIR O DOCKER DO BACKEND

#### (opcional) derruba e zera os volumes do MySQL
docker compose down -v

#### sobe de novo
docker compose up -d --build

# dentro do container app
docker exec -it medihub bash

#### migra e semeia com config explícita
```bash
php vendor/bin/phinx migrate -e development --configuration=/var/www/html/phinx.php -vvv
php vendor/bin/phinx seed:run -e development --configuration=/var/www/html/phinx.php -vvv
```


