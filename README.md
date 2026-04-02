# 📱 App de Cadastro com CEP Automático

Um aplicativo React Native com Expo para cadastrar usuários com busca automática de endereço por CEP.

## 🎯 Funcionalidades

- ✅ **Cadastro de usuários** com formulário completo
- ✅ **Busca de CEP automática** usando API ViaCEP
- ✅ **Armazenamento local** de dados com AsyncStorage
- ✅ **Listagem de usuários** cadastrados
- ✅ **Deletar usuários** da lista
- ✅ Implementação com **async/await** e **fetch**

## 🚀 Como Usar

### 1. Instalação

```bash
cd "c:\Users\Alunos\Desktop\mobile ll\atividade\MeuApp"
npm install
```

### 2. Executar o App

```bash
npm start
```

### 3. Abrir em:
- **Android**: Pressione `a`
- **Web**: Pressione `w`
- **iOS**: Pressione `i` (Mac)

## 📋 Como Usar

### Na aba CADASTRO:
1. Digite Nome
2. Digite Email
3. Digite CEP (ex: 01310100)
4. Clique "Buscar"
5. Campos preenchem automaticamente
6. Clique "Salvar Usuário"

### Na aba USUÁRIOS:
- Vê lista de cadastrados
- Clique X para deletar
- Clique "Recarregar" para atualizar

## 📚 Documentação IMPORTANTE

**Leia estes arquivos para aprender:**

1. **[EXPLICACAO_DETALHADA.md](EXPLICACAO_DETALHADA.md)** - Guia completo com explicações de:
   - O que é `async/await`
   - Como `fetch` funciona
   - Como `AsyncStorage` armazena dados
   - Fluxo completo da aplicação

2. **[EXEMPLOS_PRATICOS.md](EXEMPLOS_PRATICOS.md)** - Exemplos práticos com:
   - Analogias (pizza, etc)
   - Código comentado
   - Exercícios para você tentar
   - Padrões que você pode reusar

## 🔑 Conceitos Implementados

- `async/await` - Operações assíncronas
- `fetch` - Requisições HTTP
- `AsyncStorage` - Armazenamento local
- Try/Catch - Tratamento de erros
- React Hooks - useState, useFocusEffect

## 📁 Estrutura

```
src/utils/
├── cepService.js      # Busca CEP (fetch + async/await)
└── storageService.js  # Armazena dados (AsyncStorage + async/await)

app/
├── _layout.tsx        # Navegação com abas
├── cadastro.tsx       # Tela de cadastro
└── lista.tsx          # Tela de listagem
```

## ✨ Próximos Passos

- [ ] Validação de email
- [ ] Editar usuário
- [ ] Buscar usuário
- [ ] Exportar dados
- [ ] Dark mode

## 🎓 Para o Professor

Projeto implementa **todos** os requisitos:
- ✅ Interface funcional
- ✅ Sistema de CEP automático
- ✅ Armazenamento local
- ✅ Listagem de usuários
- ✅ Usa `fetch`, `async`, `await`
- ✅ Feito com Expo
- ✅ Bem documentado

**Desenvolvido com ❤️ para fins educacionais**
