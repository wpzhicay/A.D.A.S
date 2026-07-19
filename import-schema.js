const { Pool } = require('pg');
const fs = require('fs');

const connectionString = 'postgresql://postgres:MpOyDPVpAlznwGuknWMoZfRuIFmNjdPT@tokaido.proxy.rlwy.net:32446/railway';

const pool = new Pool({
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false }
});

async function importSchema() {
  try {
    console.log('Conectando a PostgreSQL...');
    const client = await pool.connect();
    
    const schema = fs.readFileSync('backend/database.sql', 'utf8');
    const statements = schema.split(';').filter(stmt => stmt.trim());
    
    console.log(`Ejecutando ${statements.length} statements...`);
    
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i].trim();
      if (stmt) {
        try {
          await client.query(stmt);
          console.log(`✓ Statement ${i + 1}/${statements.length}`);
        } catch (err) {
          console.error(`Error en statement ${i + 1}: ${err.message}`);
        }
      }
    }
    
    console.log('✓ Schema importado exitosamente');
    
    client.release();
    await pool.end();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

importSchema();
