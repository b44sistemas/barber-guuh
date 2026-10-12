const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://banco-mongodb:27017/barber';
  
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB] Conectado com sucesso ao host: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`[MongoDB] Erro ao conectar no banco: ${error.message}`);
    console.log('[MongoDB] A aplicação continuará executando em modo resiliente.');
    return false;
  }
};

module.exports = connectDB;
