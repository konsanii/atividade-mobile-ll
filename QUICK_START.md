# ⚡ Quick Start - Começar Rápido

## 🚀 Para rodar o app (5 passos)

### 1. Abrir Terminal
Abra um terminal/prompt de comando

### 2. Entrar na pasta
```bash
cd "c:\Users\Alunos\Desktop\mobile ll\atividade\MeuApp"
```

### 3. Instalar (se não tiver feito)
```bash
npm install
```

### 4. Iniciar servidor
```bash
npm start
```

Você verá:
```
To run:
  - press a for Android
  - press i for iOS (Mac)
  - press w for web
```

### 5. Escolher plataforma
- Pressione **a** para Android
- Ou **w** para Web

---

## 🎯 Testando o App

### Teste 1: Buscar CEP
1. Vá para aba "**Cadastro**"
2. Digite:
   - Nome: `João Silva`
   - Email: `joao@email.com`
   - CEP: `01310100` (São Paulo)
3. Clique "**Buscar**"
4. ✅ Deve preencher rua, bairro, cidade, estado

### Teste 2: Salvar Usuário
1. Clique "**Salvar Usuário**"
2. Vá para aba "**Usuários**"
3. ✅ Deve aparecer o usuário na lista

### Teste 3: Deletar Usuário
1. Na aba "**Usuários**"
2. Clique no botão "**X**" vermelho
3. Confirme a deletação
4. ✅ Usuário deve desaparecer

---

## 🔍 Estrutura de Pastas

```
MeuApp/
│
├── app/                          ← Telas do app
│   ├── _layout.tsx              ← Navegação com abas
│   ├── cadastro.tsx             ← Tela "Cadastro"
│   └── lista.tsx                ← Tela "Usuários"
│
├── src/
│   └── utils/                   ← Funções úteis
│       ├── cepService.js        ← Busca CEP da API
│       └── storageService.js    ← Salva/busca no celular
│
├── README.md                    ← Como usar
├── EXPLICACAO_DETALHADA.md      ← Guia completo
└── EXEMPLOS_PRATICOS.md         ← Exemplos com código

```

---

## 📚 Arquivos Para Estudar

| Arquivo | Conteúdo | Tempo |
|---------|----------|-------|
| **README.md** | Guia rápido | 5 min |
| **EXPLICACAO_DETALHADA.md** | Tudo explicado | 20 min |
| **EXEMPLOS_PRATICOS.md** | Exemplos de código | 15 min |

**Total recomendado**: 40 minutos de leitura = você entenderá 100%

---

## 🐛 Se Algo Não Funcionar

### "App não abre"
```bash
# Tente reinstalar:
npm install
npm start
```

### "CEP não encontra"
- Verifique se tem internet
- Tente outro CEP: `20040020` (Rio)

### "Usuários não aparecem"
- Cadastre um novo primeiro
- Os dados aparecem depois de salvar

### "Erro de conexão"
- API ViaCEP pode estar fora
- Tente em 5 minutos

---

## 💡 Atalhos Úteis

| Tecla | Ação |
|-------|------|
| `a` | Abre Android |
| `w` | Abre Web |
| `i` | Abre iOS (Mac) |
| `r` | Recarrega app |
| `c` | Limpa console |
| `j` | Debug no Chrome |

---

## 🎓 Conceitos Mais Importantes

### 1️⃣ Async/Await
```javascript
async function exemplo() {
  const dados = await fetch('...'); // Espera terminar
  return dados;
}
```

### 2️⃣ Fetch (requisição HTTP)
```javascript
const response = await fetch('https://viacep.com.br/...');
const dados = await response.json();
```

### 3️⃣ AsyncStorage (salva no celular)
```javascript
await AsyncStorage.setItem('chave', 'valor'); // Salva
const valor = await AsyncStorage.getItem('chave'); // Busca
```

### 4️⃣ Try/Catch (trata erros)
```javascript
try {
  // código que pode falhar
} catch (erro) {
  // se falhar, vem pra cá
}
```

---

## ✨ Recursos Externos

- **ViaCEP API**: https://viacep.com.br/
  - Busca endereço por CEP
  - Gratuita
  - Sem limite

- **React Native Docs**: https://reactnative.dev/
  - Documentação oficial
  - Muito útil

- **Expo Docs**: https://docs.expo.dev/
  - Documentação do Expo
  - Guias passo-a-passo

---

## 🎯 Checklist do Projeto

- ✅ Interface funcional com abas
- ✅ Busca de CEP automática (ViaCEP API)
- ✅ Armazenamento local (AsyncStorage)
- ✅ Listagem de usuários
- ✅ Deletar usuários
- ✅ Usa `fetch`, `async`, `await`
- ✅ Feito com Expo
- ✅ Documentação completa
- ✅ Sem erros de linting

**Tudo pronto para apresentar ao professor!** 🎓

---

**Dúvidas? Leia os arquivos de documentação!**

1. Entender tudo? → Leia **EXPLICACAO_DETALHADA.md**
2. Ver exemplos? → Leia **EXEMPLOS_PRATICOS.md**
3. Começar logo? → Use este arquivo para rodar
