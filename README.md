# Sistema de Agendamento Médico

Sistema web para gerenciamento de agendamentos médicos, desenvolvido como projeto acadêmico da disciplina de Programação Web.

## Tecnologias utilizadas

### Backend
- Node.js
- Express
- MySQL
- mysql2/promise
- dotenv
- CORS

### Frontend
- Vue.js
- Vite
- JavaScript
- HTML
- CSS

## Funcionalidades

- Listagem de médicos e especialidades.
- Cadastro de agendamentos médicos.
- Listagem dos agendamentos cadastrados.
- Filtro de agendamentos por médico.
- Filtro de agendamentos por data.
- Cancelamento de agendamentos.
- Integração entre frontend, backend e banco de dados MySQL.


## Requisitos

Antes de executar o projeto, é necessário ter instalado:

- Node.js e npm.
- MySQL Server.
- Git.

## Instalação e configuração

### 1. Clonar o repositório


git clone https://github.com/thiagoransdorf98/agendamento-medico.git


Entre na pasta do projeto:


cd agendamento-medico


### 2. Configurar o banco de dados

Acesse o MySQL:


mysql -u root -p


Execute o script SQL localizado em `database/schema.sql`, que cria o banco de dados, as tabelas e cadastra os médicos iniciais.

Também é possível executar o script diretamente pelo terminal, na pasta principal do projeto:


mysql -u root -p < database/schema.sql


### 3. Configurar as variáveis de ambiente

Na pasta principal do projeto, copie o arquivo de exemplo:


cp .env.example backend/.env


Abra `backend/.env` e configure as credenciais do seu MySQL:


PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=agendamento_medico


Substitua `seu_usuario` e `sua_senha` pelas credenciais do seu banco de dados.

**Importante:** o arquivo `.env` contém informações privadas e não deve ser enviado ao GitHub.

### 4. Instalar e executar o backend

Abra um terminal e execute:


cd backend
npm install
npm run dev


O backend será iniciado em:


http://localhost:3000


### 5. Instalar e executar o frontend

Abra outro terminal e execute:


cd frontend
npm install
npm run dev


Acesse o sistema pelo navegador:


http://localhost:5173


## Rotas da API

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/medicos` | Lista os médicos cadastrados. |
| GET | `/api/agendamentos` | Lista os agendamentos. |
| GET | `/api/agendamentos?medico_id=1` | Filtra agendamentos por médico. |
| GET | `/api/agendamentos?data=2026-11-17` | Filtra agendamentos por data. |
| POST | `/api/agendamentos` | Cadastra um novo agendamento. |
| DELETE | `/api/agendamentos/:id` | Cancela um agendamento. |

## Banco de dados

O banco de dados utilizado é o `agendamento_medico`, composto por duas tabelas principais:

- **medicos:** armazena os médicos e suas especialidades.
- **agendamentos:** armazena os dados dos pacientes, médicos, datas, horários e observações.

A tabela `agendamentos` possui uma chave estrangeira que estabelece o relacionamento com a tabela `medicos`.


Desenvolvido como atividade acadêmica da disciplina de Programação Web.