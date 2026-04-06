#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const readline = require('readline');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function createAdminUser() {
  try {
    const email = await ask('Digite o email do usuário admin: ');
    const password = await ask('Digite a senha do usuário admin: ');

    console.log('Criando usuário admin...');

    // Create user with admin API (bypasses email confirmation)
    const { data: userData, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
    });

    if (createError) {
      console.error('Erro ao criar usuário:', createError);
      return;
    }

    console.log('Usuário criado com sucesso:', userData.user.id);

    // Update profile to set is_admin = true
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: userData.user.id,
        is_admin: true,
        full_name: 'Admin User',
      });

    if (profileError) {
      console.error('Erro ao atualizar perfil:', profileError);
      return;
    }

    console.log('Usuário admin criado com sucesso! Você pode fazer login com:', email);

  } catch (error) {
    console.error('Erro:', error);
  } finally {
    rl.close();
  }
}

createAdminUser();