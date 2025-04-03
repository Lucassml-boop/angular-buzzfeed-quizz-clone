# 🧩 Angular BuzzFeed Quiz Clone

Este é um projeto de clone do BuzzFeed Quiz desenvolvido com Angular. Ele permite que os usuários respondam a quizzes e obtenham resultados baseados em suas respostas. O projeto utiliza uma API local para gerenciar os dados dos quizzes, perguntas e resultados.

## Tecnologias Utilizadas

- **Angular CLI**: Versão 14.1.2
- **TypeScript**
- **JSON Server**: Para simular uma API local
- **HTML5 e CSS3**
- **Material Design**: Para estilização e componentes visuais

---

## Funcionalidades

- Listagem de quizzes disponíveis na página inicial.
- Exibição de perguntas e opções de resposta para cada quiz.
- Cálculo de resultados com base nas respostas do usuário.
- API local para gerenciar quizzes, perguntas e resultados.
- Design responsivo e interativo.

---

## Pré-requisitos

Antes de começar, certifique-se de ter as seguintes ferramentas instaladas:

- [Node.js](https://nodejs.org/) (versão 14 ou superior)
- [Angular CLI](https://angular.io/cli) (versão 14.1.2 ou superior)
- [JSON Server](https://github.com/typicode/json-server)

---

## Como Executar o Projeto

### 1. Clone o Repositório

```bash
git clone https://github.com/seu-usuario/angular-buzzfeed-quizz-clone.git
cd angular-buzzfeed-quizz-clone
```

### 2. Instale as Dependências
```bash
npm install
```
### 3. Inicie o Servidor de Desenvolvimento
Execute o comando abaixo para iniciar o servidor Angular:
```bash
ng serve
```
Acesse a aplicação em: http://localhost:4200

### 4. Inicie o JSON Server
O projeto utiliza o db.json como banco de dados local. Para iniciar o JSON Server, execute:

```bash
json-server --watch db.json --port 3000
```
A API estará disponível em: http://localhost:3000

# Estrutura do Projeto
```
src/
├── app/
│   ├── components/
│   │   ├── quizz/          # Componente para exibir o quiz
│   │   └── home/           # Componente para a página inicial
│   ├── services/
│   │   └── quiz.service.ts # Serviço para consumir a API local
│   └── app.module.ts       # Módulo principal do Angular
├── assets/
│   └── images/             # Imagens utilizadas no projeto
├── environments/           # Configurações de ambiente
├── index.html              # Arquivo HTML principal
└── styles.css              # Estilos globais
```

## Endpoints da API Local
### Quizzes: GET http://localhost:3000/quizzes
### Perguntas: GET http://localhost:3000/questions?quizId={id}
### Resultados: GET http://localhost:3000/results
