# 📱 Sistema de Cadastro de Usuários com CEP Automático - React Native + Expo

## 🎯 Resumo da Aplicação

Esta é uma aplicação React Native com Expo que implementa um sistema de cadastro de usuários com:
- ✅ Busca automática de endereço por CEP
- ✅ Armazenamento local de dados (AsyncStorage)
- ✅ Listagem de usuários cadastrados
- ✅ Implementação de `async/await` e `fetch` (conforme solicitado pelo professor)

---

## 📁 Estrutura de Pastas

```
MeuApp/
├── app/
│   ├── _layout.tsx          # Configuração de navegação com abas
│   ├── cadastro.tsx         # Tela de cadastro
│   ├── lista.tsx            # Tela de listagem
│   └── (tabs)/              # Pasta de abas padrão (pode ser removida)
├── src/
│   ├── utils/
│   │   ├── cepService.js    # Serviço de busca de CEP
│   │   └── storageService.js # Serviço de armazenamento local
│   └── screens/             # Componentes de tela
├── package.json
└── README.md
```

---

## 🚀 Como Executar

### 1. Entrar na pasta do projeto
```bash
cd c:\Users\Alunos\Desktop\mobile\ ll\atividade\MeuApp
```

### 2. Instalar dependências (já feito)
```bash
npm install
```

### 3. Iniciar o servidor Expo
```bash
npm start
```

### 4. Executar em:
- **Android**: Pressione `a` no terminal
- **iOS**: Pressione `i` (apenas no Mac)
- **Web**: Pressione `w`

---

## 📚 Explicação Detalhada dos Conceitos

### 1️⃣ **ASYNC/AWAIT - O que é?**

`async/await` é uma forma moderna de trabalhar com operações assíncronas (que levam tempo para completar, como requisições de rede).

**Exemplo básico:**
```javascript
// Função async - ela sempre retorna uma Promise
async function minhaFuncao() {
  console.log('Começou');
  
  // await pausa a execução até a Promise ser resolvida
  const resultado = await fetch('https://api.exemplo.com/dados');
  
  console.log('Terminou');
  return resultado;
}
```

**Como funciona:**
- `async` - marca a função como assíncrona
- `await` - espera a Promise ser resolvida antes de continuar
- Sem `await`, o código não espera e continua executando

### 2️⃣ **FETCH - Fazendo Requisições HTTP**

`fetch` é uma função que faz requisições para APIs na internet.

**Exemplo no nosso projeto** (arquivo `cepService.js`):
```javascript
const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
```

**O que acontece:**
1. `fetch()` faz uma requisição para a API ViaCEP
2. `await` espera a resposta chegar
3. `response` contém os dados da resposta
4. `response.json()` converte os dados em objeto JavaScript

---

## 🔍 Vamos Analisar Cada Arquivo

### 📁 `src/utils/cepService.js` - Buscando CEP

```javascript
export const buscarEnderecoPorCep = async (cep) => {
  // 1. Limpa o CEP (remove traços)
  const cepLimpo = cep.replace(/\D/g, '');
  
  // 2. Faz a requisição com FETCH
  const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
  
  // 3. Converte para JSON com AWAIT
  const dados = await response.json();
  
  // 4. Retorna os dados formatados
  return {
    cep: dados.cep,
    rua: dados.logradouro,
    bairro: dados.bairro,
    cidade: dados.localidade,
    estado: dados.uf,
  };
};
```

**Fluxo:**
1. Usuário digita CEP e clica "Buscar"
2. Função é chamada com `await`
3. Faz requisição para ViaCEP
4. Aguarda resposta
5. Retorna endereço preenchido automaticamente

---

### 💾 `src/utils/storageService.js` - Armazenamento Local

```javascript
export const salvarUsuario = async (usuario) => {
  // 1. Busca usuários existentes do AsyncStorage
  const usuariosJson = await AsyncStorage.getItem(CHAVE_USUARIOS);
  const usuarios = usuariosJson ? JSON.parse(usuariosJson) : [];
  
  // 2. Cria novo usuário com ID único
  const novoUsuario = {
    id: Date.now().toString(),
    ...usuario,  // Espalha os dados do usuário
    dataCadastro: new Date().toLocaleDateString('pt-BR'),
  };
  
  // 3. Adiciona à lista
  usuarios.push(novoUsuario);
  
  // 4. Salva no AsyncStorage (ARMAZENAMENTO LOCAL)
  await AsyncStorage.setItem(CHAVE_USUARIOS, JSON.stringify(usuarios));
};
```

**O que é AsyncStorage?**
- É um banco de dados local do celular
- Dados ficam salvos mesmo fechando o app
- Limitado (~5-10MB por app)

**Fluxo:**
1. Clica "Salvar Usuário"
2. Função busca usuários já salvos
3. Adiciona novo usuário à lista
4. Salva tudo no AsyncStorage

---

### 📝 `app/cadastro.tsx` - Tela de Cadastro

**Principais funções async/await:**

```javascript
// Busca CEP quando usuário clica no botão
const handleBuscarCep = async () => {
  setCarregando(true);
  try {
    // AWAIT - espera a busca terminar
    const endereco = await buscarEnderecoPorCep(cep);
    
    // Preenche os campos
    setRua(endereco.rua);
    setBairro(endereco.bairro);
    // ...
  } catch (erro) {
    Alert.alert('Erro', erro.message);
  } finally {
    setCarregando(false);
  }
};

// Salva o usuário quando clica "Salvar"
const handleSalvarUsuario = async () => {
  setCarregando(true);
  try {
    // AWAIT - espera salvar terminar
    await salvarUsuario({
      nome,
      email,
      cep,
      // ...
    });
    Alert.alert('Sucesso', 'Usuário cadastrado!');
    // Limpa formulário
  } finally {
    setCarregando(false);
  }
};
```

**O que significa `setCarregando`?**
- Enquanto faz requisição, mostra um loading (girando)
- Desabilita os botões enquanto carrega
- Melhora a experiência do usuário

---

### 📋 `app/lista.tsx` - Tela de Listagem

```javascript
// Carrega usuários quando a tela ganha foco
useFocusEffect(
  React.useCallback(() => {
    carregarUsuarios();
  }, [])
);

// Função async para carregar do armazenamento
const carregarUsuarios = async () => {
  setCarregando(true);
  try {
    // AWAIT - espera buscar dados
    const usuariosCarregados = await obterTodosUsuarios();
    setUsuarios(usuariosCarregados);
  } finally {
    setCarregando(false);
  }
};
```

**Fluxo:**
1. Usuário muda para a aba "Usuários"
2. `useFocusEffect` detecta isso
3. Chama `carregarUsuarios()`
4. Busca dados do AsyncStorage
5. Mostra lista na tela

---

## 🎨 Componentes Principais

### 1. **Tela de Cadastro**
- Campo de Nome
- Campo de Email
- Campo de CEP com botão "Buscar"
- Campos preenchidos automaticamente (Rua, Bairro, Cidade, Estado)
- Botão "Salvar Usuário"

### 2. **Tela de Lista**
- Mostra todos os usuários cadastrados
- Cada usuário em um "cartão"
- Botão para deletar cada usuário
- Badge mostrando total de usuários
- Botão para recarregar lista

---

## 🔑 Conceitos-Chave Implementados

| Conceito | Uso | Arquivo |
|----------|-----|--------|
| **async** | Marca funções assíncronas | Todos os `.js` |
| **await** | Aguarda Promise resolver | `cepService.js`, `storageService.js` |
| **fetch** | Faz requisição HTTP | `cepService.js` |
| **try/catch** | Trata erros | Todos os serviços |
| **AsyncStorage** | Armazenamento local | `storageService.js` |
| **useState** | Gerencia estado | `cadastro.tsx`, `lista.tsx` |
| **useFocusEffect** | Detecta quando tela ganha foco | `lista.tsx` |

---

## 🔄 Fluxo Completo de Uso

### Cenário: Usuário Cadastra Nova Pessoa

```
1. Usuário entra em "Cadastro"
   ↓
2. Digita: Nome, Email, CEP
   ↓
3. Clica "Buscar"
   ├─ handleBuscarCep() é chamada com `async`
   ├─ await buscarEnderecoPorCep(cep) faz FETCH para ViaCEP
   ├─ Aguarda resposta (await)
   └─ Preenche campos automaticamente
   ↓
4. Clica "Salvar Usuário"
   ├─ handleSalvarUsuario() é chamada com `async`
   ├─ await salvarUsuario(...) faz requisição ao AsyncStorage
   ├─ Dados são salvos localmente
   └─ Mostra mensagem de sucesso
   ↓
5. Usuário vai para "Usuários"
   ├─ useFocusEffect detecta mudança de tela
   ├─ await carregarUsuarios() faz requisição ao AsyncStorage
   ├─ Nova pessoa aparece na lista
   └─ mostra badge com total de 1 usuário
```

---

## 🛠️ Dependências Instaladas

```json
{
  "expo": "Plataforma React Native",
  "@react-native-async-storage/async-storage": "Armazenamento local",
  "@react-navigation/native": "Sistema de navegação",
  "@react-navigation/bottom-tabs": "Abas na parte inferior",
  "expo-router": "Roteamento de telas"
}
```

---

## 🐛 Troubleshooting

### "CEP não encontrado"
- Verifique se o CEP está correto
- Conexão com internet (API precisa estar acessível)

### "Nenhum usuário aparece"
- AsyncStorage pode estar vazio
- Tente cadastrar um novo usuário

### App está lento
- AsyncStorage é lento com muitos dados
- Limite a lista ou considere um banco real (SQLite)

---

## ✨ Melhorias Futuras

- ✅ Adicionar validação de email
- ✅ Editar usuário existente
- ✅ Exportar dados em PDF
- ✅ Usar banco de dados SQLite
- ✅ Adicionar imagem/foto do usuário
- ✅ Sincronizar com servidor Firebase

---

## 📞 Dúvidas?

Qualquer dúvida sobre `async/await`, `fetch`, ou `AsyncStorage`?

**Conceitos mais importantes:**
- `async` torna a função assíncrona
- `await` pausa e aguarda o resultado
- `fetch` faz requisições HTTP
- `AsyncStorage` armazena dados localmente
- `try/catch` trata erros

Esses 5 conceitos são a base de 90% do código!

---

**Desenvolvido para fins educacionais com ❤️**
