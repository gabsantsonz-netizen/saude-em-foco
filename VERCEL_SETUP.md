# Configuração no Vercel - Guia de Setup

## 📋 Overview
Este guia fornece instruções passo a passo para configurar a aplicação Saúde em Foco no Vercel com autenticação via Supabase.

## 🔧 Variáveis de Ambiente Necessárias

O middleware do Supabase agora valida automaticamente as variáveis de ambiente. Certifique-se de configurar as seguintes variáveis no Vercel:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## 📌 Como Obtém essas Chaves

1. Acesse [Supabase Dashboard](https://app.supabase.com)
2. Selecione seu projeto
3. Vá para **Settings** → **API** (ou **Configuration** → **API**)
4. Copie:
   - **URL**: `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 🚀 Configuração no Vercel - Opção 1: Web Dashboard

1. Acesse [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecione seu projeto
3. Clique em **Settings** → **Environment Variables**
4. Adicione as variáveis:
   - Nome: `NEXT_PUBLIC_SUPABASE_URL`
   - Valor: `https://your-project.supabase.co`
   - Selecione: **Production**, **Preview**, **Development**
   
5. Clique em **Add** e repita para `NEXT_PUBLIC_SUPABASE_ANON_KEY`:
   - Nome: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Valor: `your_anon_key_here`
   - Selecione: **Production**, **Preview**, **Development**

6. **Redeploy**: Acesse a aba **Deployments** e clique no botão de redeploy para aplicar as novas variáveis

## 🚀 Configuração no Vercel - Opção 2: CLI

Se você preferir usar a linha de comando:

```bash
# 1. Instale o Vercel CLI
npm i -g vercel

# 2. Configure as variáveis de ambiente
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY

# 3. Digite os valores quando solicitado

# 4. Redeploy do projeto
vercel --prod
```

## 🔐 Segurança

- As variáveis com prefixo `NEXT_PUBLIC_` são expostas ao cliente (navegador) - isso é normal e seguro para a chave anon
- Nunca exponha a `SUPABASE_SERVICE_ROLE_KEY` ao cliente
- Essas chaves não são senhas, são chaves públicas de API

## ✅ Testes Após Deploy

Depois de configurar as variáveis no Vercel:

1. Acesse sua aplicação em produção
2. Tente acessar uma rota protegida (ex: `/protected`)
   - Você deve ser redirecionado para `/auth/login`
3. Tente fazer login
4. Verifique o console do navegador (F12) para erros

## 🐛 Troubleshooting

### Erro 500 no Middleware
Se receber erro 500:
1. Verifique se as variáveis de ambiente estão configuradas no Vercel
2. Clique em **Redeploy** após adicionar as variáveis
3. Espere 1-2 minutos para o deployment completar

### Usuário deslogando aleatoriamente
- Certifique-se de que os cookies estão sendo configurados corretamente
- Verifique a política de cookies no dashboard do Supabase
- Verifique se o domínio está correto nas configurações do Supabase

### Problema com Edge Runtime
O middleware agora foi otimizado para funcionar com o Edge Runtime do Vercel:
- Adiciona try/catch para erros
- Valida variáveis de ambiente no início
- Continua com a requisição se ocorrer erro não-crítico

## 📚 Middlewares Adicionais

Se precisar adicionar validações adicionais ao middleware, edite:
```
lib/supabase/middleware.ts
```

O middleware atual:
- ✅ Valida variáveis de ambiente
- ✅ Trata erros com try/catch
- ✅ Compatível com Edge Runtime
- ✅ Mantém lógica de redirecionamento para login
- ✅ Preserva cookies de autenticação

## 🔗 Recursos Úteis

- [Supabase Docs - SSR Auth](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Next.js Middleware Docs](https://nextjs.org/docs/advanced-features/middleware)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [Edge Runtime Limitations](https://vercel.com/docs/functions/edge-functions)
