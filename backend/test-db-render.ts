import { ConnectionString } from 'pg-connection-string';

/**
 * Test script to verify DATABASE_URL parsing in Render
 * Run with: npx ts-node test-db-render.ts
 */

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('❌ DATABASE_URL environment variable not set');
  process.exit(1);
}

console.log('🔍 Testing DATABASE_URL parsing...\n');
console.log('Raw DATABASE_URL:', databaseUrl.substring(0, 50) + '...');

try {
  const connectionString = new ConnectionString(databaseUrl);
  
  console.log('\n✓ Parsed connection string:');
  console.log('  Host:', connectionString.host);
  console.log('  Port:', connectionString.port || 5432);
  console.log('  User:', connectionString.user);
  console.log('  Database:', connectionString.database);
  console.log('  Password length:', connectionString.password?.length || 0);
  
  // Test with pg library
  const { Client } = require('pg');
  
  const client = new Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false }
  });
  
  client.connect((err: any) => {
    if (err) {
      console.error('\n❌ Connection failed:', err.message);
      process.exit(1);
    } else {
      console.log('\n✅ Successfully connected to database!');
      client.query('SELECT NOW()', (err: any, result: any) => {
        if (err) {
          console.error('Query error:', err.message);
        } else {
          console.log('✓ Current database time:', result.rows[0].now);
        }
        client.end();
        process.exit(0);
      });
    }
  });
  
} catch (error: any) {
  console.error('❌ Error parsing DATABASE_URL:', error.message);
  process.exit(1);
}
