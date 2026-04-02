# 🎓 Exemplos Práticos: Async/Await e Fetch

## Entendendo Async/Await com Analogias

### Analogia 1: Pedido em uma Pizzaria 🍕

**SEM ASYNC/AWAIT (Não recomendado):**
```javascript
// Você entra, pede pizza, e fica esperando sem fazer nada
console.log('Pedindo pizza...');
const pizza = fetch('pizzaria.com/pedir'); // Não espera!
console.log('Comendo pizza!'); // ❌ Pizza ainda não chegou!
console.log(pizza); // ❌ Undefined (vazio)!
```

**COM ASYNC/AWAIT (Correto):**
```javascript
async function pedirPizza() {
  console.log('Pedindo pizza...');
  const pizza = await fetch('pizzaria.com/pedir'); // ⏳ Espera chegar
  console.log('Comendo pizza!'); // ✅ Pizza já chegou!
  console.log(pizza); // ✅ Pizza aqui!
}
```

---

## Exemplos práticos do nosso projeto

### 1. Buscar CEP (usar Fetch)

**Passo por passo do que acontece:**

```javascript
const buscarCep = async (cep) => {
  // 1️⃣ FETCH faz requisição para internet
  const response = await fetch('https://viacep.com.br/ws/01310100/json/');
  
  // 2️⃣ Espera resposta (pode levar 1-2 segundos)
  // ⏳ Código PARADO aqui enquanto não chega resposta
  
  // 3️⃣ Resposta chegou! Continua...
  console.log(response.status); // 200 (sucesso)
  console.log(response.ok);     // true
  
  // 4️⃣ Converte resposta (que é texto) para objeto JSON
  const dados = await response.json();
  
  // 5️⃣ Agora tem os dados!
  console.log(dados.logradouro); // "Avenida Paulista"
  console.log(dados.localidade); // "São Paulo"
  
  return dados;
};

// 🟢 Chamando a função
const resultado = await buscarCep('01310100');
console.log('Prédio:', resultado.logradouro);
```

**O que acontece na ordem:**
```
1. Função é chamada com await
2. ⏳ Espera resposta da internet (0-3 segundos)
3. Resposta chega
4. await response.json() converte dados
5. ⏳ Espera conversão
6. Dados prontos!
7. Console.log imprime
```

---

### 2. Salvar no AsyncStorage (Armazenamento Local)

```javascript
// ❌ ERRADO - Sem async/await
const salvar = () => {
  AsyncStorage.setItem('usuario', 'João'); // Não espera!
  const salvo = AsyncStorage.getItem('usuario'); // Ainda não foi salvo!
  console.log(salvo); // undefined
};

// ✅ CORRETO - Com async/await
const salvar = async () => {
  await AsyncStorage.setItem('usuario', 'João'); // Espera salvar
  const salvo = await AsyncStorage.getItem('usuario'); // Agora consegue
  console.log(salvo); // "João" ✅
};
```

---

### 3. Tratando Erros com Try/Catch

```javascript
const buscarComErro = async (cep) => {
  try {
    // 🟢 TRY = Tenta fazer isso
    console.log('Buscando...');
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    
    if (!response.ok) {
      throw new Error('Erro na requisição'); // ❌ Gera erro
    }
    
    const dados = await response.json();
    console.log('Achei:', dados);
    return dados;
    
  } catch (erro) {
    // 🔴 CATCH = Se algo deu errado acima, vem pra cá
    console.error('Falha:', erro.message);
    return null; // Retorna vazio
  }
};
```

**Simulando um erro:**
```javascript
await buscarComErro('99999999-invalid');
// Console:
// "Buscando..."
// "Falha: CEP não encontrado"
// Retorna: null
```

---

## Comparação: Síncrono vs Assíncrono

### Código SÍNCRONO (não recomendado na web)

```javascript
// ❌ Trava a interface enquanto baixa
const buscarSync = (url) => {
  // Faz requisição (NÃO EXISTE SYNC NO JAVASCRIPT MODERNO)
  // Mas se existisse, travaria a tela!
  
  // Enquanto aguarda resposta:
  // ❌ Botões não respondem
  // ❌ Scroll não funciona
  // ❌ App fica congelado
  // ❌ Ruim demais!
};
```

### Código ASSÍNCRONO (recomendado ✅)

```javascript
// ✅ Não trava a interface
const buscarAsync = async (url) => {
  setCarregando(true); // Mostra loading
  
  const dados = await fetch(url); // Espera (mas a interface funciona!)
  
  // Enquanto aguarda resposta:
  // ✅ Botões respondEM
  // ✅ Scroll funciona
  // ✅ App responsivo
  // ✅ Melhor!
  
  setCarregando(false); // Remove loading
  return dados;
};
```

---

## Exemplo Completo: Um Fluxo Real

```javascript
// Simular um servidor respondendo
const simuladorAPI = async () => {
  return new Promise((resolve, reject) => {
    // Simula demora de 2 segundos
    setTimeout(() => {
      resolve({
        id: 1,
        nome: 'João Silva',
        email: 'joao@email.com'
      });
    }, 2000);
  });
};

// Usar a API
const executar = async () => {
  console.log('▶️ Começando...');
  
  try {
    console.log('⏳ Buscando dados (aguarde 2s)...');
    const usuario = await simuladorAPI();
    
    console.log('✅ Dados recebidos!');
    console.log(usuario.nome);  // "João Silva"
    console.log(usuario.email); // "joao@email.com"
    
  } catch (erro) {
    console.error('❌ Erro:', erro);
  }
};

executar();
```

**O que você vê no console:**
```
▶️ Começando...
⏳ Buscando dados (aguarde 2s)...
[espera 2 segundos aqui...]
✅ Dados recebidos!
João Silva
joao@email.com
```

---

## Estrutura Genérica: Modelo que você pode reusar

```javascript
// Padrão async/await que funciona em qualquer situação
const minhaFuncaoAssincrona = async () => {
  try {
    // 1️⃣ Mostra que está carregando
    setCarregando(true);
    
    // 2️⃣ Busca dados (com AWAIT)
    const resposta = await fetch('sua-api.com/dados');
    
    // 3️⃣ Verifica se foi bem-sucedido
    if (!resposta.ok) {
      throw new Error('Erro HTTP: ' + resposta.status);
    }
    
    // 4️⃣ Converte JSON (com AWAIT)
    const dados = await resposta.json();
    
    // 5️⃣ Processa dados
    console.log('Sucesso:', dados);
    
    // 6️⃣ Atualiza estado/tela
    setDados(dados);
    
    return dados;
    
  } catch (erro) {
    // 🔴 Se algo deu errado
    console.error('Erro:', erro.message);
    Alert.alert('Erro', erro.message);
    
  } finally {
    // 🟡 SEMPRE executa (sucesso ou erro)
    setCarregando(false);
  }
};
```

---

## Exercício Prático Para Você Tentar

### Desafio 1: Complete o código

```javascript
// Faça uma função que:
// 1. Pede um número para o usuário
// 2. Espera 2 segundos
// 3. Dobra o número
// 4. Mostra o resultado

const dobrarComDelay = async (numero) => {
  // Coloque seu código aqui!
  // Dica: use setTimeout em uma Promise
};

// Resultado esperado:
// dobrarComDelay(5);
// (espera 2s)  
// Resultado: 10
```

### Resposta:
```javascript
const dobrarComDelay = async (numero) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(numero * 2);
    }, 2000);
  });
};

// Usar:
const resultado = await dobrarComDelay(5);
console.log('Resultado:', resultado); // 10
```

---

## Pontos-Chave Para Lembrar

| Conceito | O que é | Quando usar |
|----------|---------|-------------|
| **async** | Marca função | Sempre que usar `await` |
| **await** | Espera resultado | Sempre que der requisição |
| **fetch** | Busca dados HTTP | APIs na internet |
| **Promise** | Promessa de resultado | Operações que demoram |
| **try/catch** | Trata erros | Proteção contra falhas |
| **finally** | Executa sempre | Limpar estado/loading |

---

## Resumo Rápido

```javascript
// 📝 Lembrete rápido

// ✅ CORRETO
async function exemplo() {
  const dados = await fetch('...'); // Espera
  return dados;
}

// ❌ ERRADO
function exemplo() {
  const dados = fetch('...'); // Não espera!
  return dados; // undefined
}

// ✅ CORRETO com erro
async function exemplo() {
  try {
    const dados = await fetch('...');
    return dados;
  } catch (erro) {
    console.error(erro);
  }
}

// ✅ CHAMAR função async
const resultado = await exemplo();
console.log(resultado);
```

Agora você entende **async/await** e **fetch**! 🚀
