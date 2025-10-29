# Medihub - API de Gerenciamento

| Pasta         | Camada                  | Responsabilidade                                                                         |
| :------------ | :---------------------- | :--------------------------------------------------------------------------------------- |
| `Controllers` | **Apresentação**        | Recebe as requisições HTTP, valida entradas e coordena a resposta.                       |
| `Services`    | **Lógica de Negócio**   | Contém todas as regras de negócio e orquestra as operações, utilizando os Models.        |
| `Models`      | **Acesso a Dados (BD)** | Representa a estrutura dos dados e a lógica de persistência (CRUD) com o banco de dados. |
| `Middlewares` | **Intercepção**         | Funções executadas antes/depois do Controller (Ex: Autenticação, Autorização).           |
| `Helpers`     | **Utilitários**         | Funções genéricas e reutilizáveis por todas as camadas (Ex: Formatação, Criptografia).   |

## 🚀 Primeiros Passos

Siga os passos abaixo para configurar e rodar o ambiente de desenvolvimento localmente.

### Pré-requisitos

Para garantir que o ambiente rode corretamente, você precisará ter instalado:

- **Docker**
- **Docker Compose**

### 1. Levantar o Ambiente com Docker

Este comando irá construir as imagens (se necessário) e levantar os contêineres definidos no `docker-compose.yml` (Aplicação, Banco de Dados, etc.).

````bash
docker compose up --build

### 2. Configurar e Popular o Banco de Dados

Com os contêineres rodando, o próximo passo é aplicar as migrações (criação das tabelas) e popular o banco de dados com dados iniciais de teste (seeders).

Execute o seguinte comando diretamente no seu terminal (fora do contêiner):

```bash
docker exec -it medihub bash -c "vendor/bin/phinx migrate -e development && vendor/bin/phinx seed:run -e development"
````
