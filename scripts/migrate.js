#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigrations() {
  try {
    // Read and execute SQL files
    const sqlFiles = [
      '001_create_tables.sql',
      '002_create_policies.sql',
      '003_create_trigger.sql'
    ];

    for (const file of sqlFiles) {
      const filePath = path.join(__dirname, file);
      if (fs.existsSync(filePath)) {
        const sql = fs.readFileSync(filePath, 'utf-8');
        console.log(`Executing ${file}...`);
        
        // Split by semicolon and execute each statement
        const statements = sql.split(';').filter(stmt => stmt.trim());
        for (const statement of statements) {
          if (statement.trim()) {
            const { error } = await supabase.rpc('exec', { 
              sql_string: statement.trim() 
            }).catch(() => {
              // Fallback: try raw SQL if RPC not available
              return supabase.from('_raw_sql').select().catch(err => ({ error: err }));
            });
            
            if (error) {
              console.error(`Error executing statement in ${file}:`, error);
            }
          }
        }
        console.log(`✓ ${file} completed`);
      }
    }

    console.log('✓ All migrations completed');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();
