import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Validar variáveis de ambiente necessárias para o Supabase
function validateEnvironmentVariables(): {
  url: string
  anonKey: string
} {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL não está definido. Verifique as variáveis de ambiente no Vercel.',
    )
  }

  if (!anonKey) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_ANON_KEY não está definido. Verifique as variáveis de ambiente no Vercel.',
    )
  }

  return { url, anonKey }
}

export async function updateSession(request: NextRequest) {
  try {
    // Validar variáveis de ambiente
    const { url, anonKey } = validateEnvironmentVariables()

    let supabaseResponse = NextResponse.next({
      request,
    })

    // Com Edge Runtime, sempre criar um novo cliente em cada requisição
    // Isso evita problemas com estado compartilhado
    const supabase = createServerClient(url, anonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    })

    // Não executar código entre createServerClient e supabase.auth.getUser()
    // Um erro simples aqui pode fazer usuários saírem aleatoriamente
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Redirecionar para login se acessar rota protegida sem autenticação
    if (
      request.nextUrl.pathname.startsWith('/protected') &&
      !user
    ) {
      const url = request.nextUrl.clone()
      url.pathname = '/auth/login'
      return NextResponse.redirect(url)
    }

    // IMPORTANTE: Retornar o objeto supabaseResponse com cookies intactos
    // Se criar um novo NextResponse, copiar os cookies:
    // 1. myNewResponse = NextResponse.next({ request })
    // 2. myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
    // 3. Fazer mudanças em myNewResponse
    // 4. return myNewResponse
    // Caso contrário, a sessão do usuário pode ser encerrada prematuramente

    return supabaseResponse
  } catch (error) {
    // Tratamento de erro para compatibilidade com Edge Runtime
    console.error('[Middleware Error]', error)

    // Se as variáveis de ambiente não estão configuradas, retornar erro 500
    // Em produção no Vercel, as variáveis devem estar definidas
    if (
      error instanceof Error &&
      error.message.includes('NEXT_PUBLIC_SUPABASE')
    ) {
      return NextResponse.json(
        {
          error: 'Configuração de Supabase inválida. Verifique as variáveis de ambiente.',
        },
        { status: 500 },
      )
    }

    // Para outros erros, continuar com a requisição
    // Isso evita que o middleware pare toda a aplicação
    return NextResponse.next({ request })
  }
}
