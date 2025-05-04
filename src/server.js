const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para permitir JSON no body
app.use(express.json());

// Rota simples
app.get('/', (req, res) => {
  res.send('API funcionando!');
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor na porta ${PORT}`);
});
