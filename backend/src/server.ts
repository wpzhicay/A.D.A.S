import express from 'express';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../frontend/dist/solar-generator-frontend')));

// Redirigir todas las rutas al index.html (para Angular routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/solar-generator-frontend/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
