# 🧾 fastify_api_rest_tasks

## 📋 Requisitos Funcionais (RF)

- [ ] O usuário deve poder criar uma conta;
- [ ] O usuário deve poder obter um extrato da sua conta;
- [ ] O usuário deve poder listar todas as transações que já ocorreram;
- [ ] O usuário deve poder visualizar uma transação única;

---

## 💼 Regras de Negócio (RN)

- [ ] A transação pode ser do tipo crédito, que somará ao valor total, ou débito, que será subtraído;
- [ ] Deve ser possível identificar o usuário entre as requisições;
- [ ] O usuário só pode visualizar transações que ele criou;

---

## ⚙️ Requisitos Não Funcionais (RNF)

- Node.js  
- TypeScript  
- Fastify  
- SQLite3  
- Knex  
- @fastify/cookie  
- Vitest  
- Zod
