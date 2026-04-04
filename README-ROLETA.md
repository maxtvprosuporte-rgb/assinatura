# 📦 Sistema de Roleta MaxTV Pro

Este ZIP contém todos os arquivos do sistema de roleta.

## 📋 Conteúdo

### Frontend (React + Firebase)
- `frontend/src/firebase/` - Configuração Firebase e Context de autenticação
- `frontend/src/pages/Auth.jsx` - Página de Login/Cadastro
- `frontend/src/pages/Roleta.jsx` - Página da roleta
- `frontend/src/pages/Assinatura.jsx` - Página de assinatura (já existente, atualizada)
- `frontend/src/App.js` - Rotas atualizadas
- `frontend/package.json` - Dependências (Firebase + Sonner adicionados)
- `frontend/yarn.lock` - Lock file das dependências

### Backend (FastAPI + MongoDB)
- `backend/models/roleta.py` - Models da roleta
- `backend/routes/roleta.py` - Rotas da API da roleta
- `backend/scripts/create_admin.py` - Script para criar admin
- `backend/server.py` - Servidor atualizado com rotas da roleta

### Extras
- `assinatura-maxtv.html` - Página standalone de assinatura
- `ARQUIVOS_PARA_COPIAR.txt` - Lista de arquivos

## 🚀 Como usar

### Opção 1: Sobrescrever arquivos existentes

1. Clone seu repositório:
```bash
git clone https://github.com/maxtvprosuporte-rgb/assinatura.git
cd assinatura
```

2. Extraia o ZIP e copie os arquivos mantendo a estrutura de pastas

3. Instale as novas dependências:
```bash
cd frontend
yarn install
```

4. Faça commit e push:
```bash
git add .
git commit -m "feat: Adicionar sistema de roleta com Firebase"
git push origin main
```

### Opção 2: Verificar antes de copiar

1. Extraia o ZIP em uma pasta temporária
2. Compare os arquivos com os seus atuais
3. Copie apenas os que precisa

## ⚙️ Configuração necessária

### Firebase já configurado:
- Project ID: maxtvpro-roleta
- As credenciais já estão em `frontend/src/firebase/config.js`

### Admin criado:
- Email: maxtvpro.suporte@gmail.com
- Senha: @SSantosmattheuSS1998

### Rotas disponíveis:
- `/auth` - Login/Cadastro
- `/roleta` - Página da roleta
- `/assinatura` - Página de assinatura

## 📝 Próximos passos após deploy

1. Testar autenticação no Firebase
2. Testar sistema de giros
3. Criar painel admin (se necessário)
4. Configurar webhook do checkout para adicionar giros automaticamente

## 🎯 Funcionalidades

✅ Sistema de autenticação Firebase
✅ Roleta com 7 prêmios (0-30 dias)
✅ Compra de giros (1, 2, 3 giros)
✅ Histórico de giros
✅ Validação backend
✅ Sistema de transações
✅ Painel de navegação

---

**Desenvolvido por Emergent AI** 🚀
