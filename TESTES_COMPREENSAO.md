# 🧪 Testes de Compreensão - Valide Seu Entendimento

Responda estas perguntas para testar se entendeu os conceitos!

---

## ❓ Pergunta 1: O que faz `async`?

**Escolha a resposta correta:**

a) Torna a função infinita
b) Marca a função como assíncrona (pode usar `await`)
c) Torna o código mais rápido
d) Remove erros

**Resposta:** **B** ✅
- `async` marca a função para usar `await`
- Sem `async`, não pode usar `await`

---

## ❓ Pergunta 2: O que faz `await`?

**Escolha a resposta correta:**

a) Para a execução e espera o resultado
b) Faz código em paralelo
c) Completa instantaneamente
d) Ignora erros

**Resposta:** **A** ✅
- `await` pausa e espera a Promise resolver
- Só pode ser usado dentro de funções `async`

---

## ❓ Pergunta 3: Qual é a função de `fetch`?

**Escolha a resposta correta:**

a) Carrega imagens
b) Faz requisições HTTP para APIs
c) Armazena dados localmente
d) Valida formulários

**Resposta:** **B** ✅
- `fetch` busca dados de URLs na internet
- No projeto, busca CEP da ViaCEP

---

## ❓ Pergunta 4: O que faz `AsyncStorage`?

**Escolha a resposta correta:**

a) Armazena dados na nuvem
b) Armazena dados localmente no celular
c) Envia dados para o servidor
d) Faz operações assíncronas

**Resposta:** **B** ✅
- AsyncStorage = banco de dados local
- Dados persistem mesmo fechando o app
- No projeto, salva usuários cadastrados

---

## ❓ Pergunta 5: Qual é a ordem correta?

**Ordene as linhas:**

```
1. const response = await fetch(url);
2. const dados = await response.json();
3. console.log(dados);
4. async function buscar(url) {
```

**Resposta correta:** 4 → 1 → 2 → 3

```javascript
async function buscar(url) {           // 4️⃣ Define função
  const response = await fetch(url);   // 1️⃣ Busca
  const dados = await response.json(); // 2️⃣ Converte
  console.log(dados);                  // 3️⃣ Mostra
}
```

---

## ❓ Pergunta 6: O que é `try/catch`?

**Escolha a resposta correta:**

a) Estrutura de repetição
b) Trata erros (try tenta, catch pega erro)
c) Faz operações paralelas
d) Valida tipos

**Resposta:** **B** ✅

```javascript
try {
  // Tenta executar
  const dados = await fetch('url-errada');
} catch (erro) {
  // Se algo der errado, vem pra cá
  console.error(erro);
}
```

---

## ✅ Teste Prático de Código

### Desafio 1: Identifique o Erro

**Qual é o problema neste código?**

```javascript
function buscarDados(url) {
  const dados = await fetch(url);
  return dados;
}
```

**Problema:** ❌ Falta `async` na função
- Não pode usar `await` sem `async`

**Correto:**
```javascript
async function buscarDados(url) {
  const dados = await fetch(url);
  return dados;
}
```

---

### Desafio 2: Complete o Código

**Complete com `async`, `await`, ou `try/catch`:**

```javascript
// ANTES (incompleto)
function salvarUsuario(nome) {
  const resultado = AsyncStorage.setItem('user', nome);
  console.log(resultado);
}

// DEPOIS (complete):
// _____ function salvarUsuario(nome) {
//   try {
//     _____ AsyncStorage.setItem('user', nome);
//     console.log('Salvo!');
//   } catch (erro) {
//     console.error(erro);
//   }
// }
```

**Resposta:**
```javascript
async function salvarUsuario(nome) {
  try {
    await AsyncStorage.setItem('user', nome);
    console.log('Salvo!');
  } catch (erro) {
    console.error(erro);
  }
}
```

---

### Desafio 3: Trace a Execução

**Qual é a ordem de execução?**

```javascript
console.log('1'); // Imprime que número?

async function exemplo() {
  console.log('2');
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log('3');
}

exemplo();

console.log('4');
```

**Resposta:**
```
1️⃣ - console.log('1') - Executa ANTES de tudo
4️⃣ - console.log('4') - Executa ANTES de exemplo() terminar
2️⃣ - console.log('2') - Executa quando exemplo() começa
3️⃣ - console.log('3') - Executa após 1 segundo

Ordem: 1 → 4 → 2 → (espera 1s) → 3
```

---

## 🎯 Mapa Mental: Async/Await

```
ASYNC/AWAIT
│
├─ async = Marca função como assíncrona
│  └─ Pode usar await dentro
│
├─ await = Pausa e espera
│  └─ Só dentro de função async
│
├─ fetch = Busca dados da internet
│  ├─ Retorna Response
│  └─ response.json() converte para objeto
│
├─ Promise = Promessa de resultado
│  ├─ pending = aguardando
│  ├─ resolved = sucesso
│  └─ rejected = erro
│
└─ try/catch = Trata erros
   ├─ try = tenta fazer
   └─ catch = trata se falhar
```

---

## 🏆 Respostas Esperadas

| Pergunta | Resposta | Conceito |
|----------|----------|----------|
| 1 | B | async marca função |
| 2 | A | await pausa execução |
| 3 | B | fetch = requisição HTTP |
| 4 | B | AsyncStorage = local |
| 5 | 4→1→2→3 | Ordem correta |
| 6 | B | try/catch = trata erros |

**Se acertou 5 ou mais: Você entendeu os conceitos! 🎉**

---

## 💬 Resumo dos Conceitos

### Async (Assíncrono)
- Operações que demoram (rede, banco de dados, timers)
- Não trava a interface
- Usa `async`/`await` para controlar

### Await (Esperar)
- Pausa execução até Promise resolver
- Só funciona dentro de função `async`
- Torna código mais legível que `.then()`

### Fetch (Buscar)
- Faz requisição HTTP
- Busca dados de URLs
- Retorna Promise com Response

### AsyncStorage (Armazenar)
- Banco de dados local do celular
- Persiste dados (sobrevive fechar app)
- Operações são assíncronas

### Try/Catch (Proteger)
- `try`: tenta executar código
- `catch`: pega erro se falhar
- `finally`: executa sempre (opcional)

---

## 🎓 Próximas Etapas

- [x] Entender async/await
- [x] Entender fetch
- [x] Entender AsyncStorage
- [x] Ver exemplos práticos
- [ ] Ler o código do projeto
- [ ] Rodar o projeto
- [ ] Modificar e experimentar
- [ ] Apresentar ao professor

---

**Parabéns por estudar! Os conceitos agora são seus! 🚀**
