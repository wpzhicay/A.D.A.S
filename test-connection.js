const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres:MpOyDPVpAlznwGuknWMoZfRuIFmNjdPT@tokaido.proxy.rlwy.net:32446/railway',
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect((err) => {
  if (err) {
    console.error('Connection error:', err.message);
    process.exit(1);
  } else {
    console.log('Connected successfully');
    client.query('SELECT version()', (err, res) => {
      if (err) {
        console.error('Query error:', err.message);
      } else {
        console.log('PostgreSQL version:', res.rows[0].version);
      }
      client.end();
    });
  }
});
