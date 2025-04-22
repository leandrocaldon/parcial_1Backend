require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const purchaseRoutes = require('./routes/purchases');

// Inicializar express
const app = express();
const PORT = process.env.PORT || 3500; // Cambiado a puerto 3500

// Configuración de CORS para permitir frontend en Vercel y localhost
const allowedOrigins = [
  'http://localhost:3000',
  'https://parcial-1-frontend.vercel.app'
];
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Middlewares
app.use(express.json());
app.use(morgan('dev'));

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/marketplace', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.error('Error en la conexión a MongoDB:', err));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/purchases', purchaseRoutes);

// Ruta para verificar que el servidor está funcionando
app.get('/', (req, res) => {
  res.json({ message: 'API de Marketplace funcionando correctamente' });
});

// Exportar handler para Vercel
module.exports = app;

// Solo iniciar el servidor si no estamos en Vercel (desarrollo local)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });
}