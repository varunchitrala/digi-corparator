const app = require('./app');
const dotenv = require('dotenv');
const { testConnection } = require('./config/db');

dotenv.config();

const PORT = process.env.PORT || 5000;

async function startServer() {
  // Test MySQL connection on boot
  await testConnection();

  app.listen(PORT, () => {
    console.log(`=============================================================`);
    console.log(`🚀 Digital Corporator Backend Service Started`);
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`⚙️ Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`=============================================================`);
  });
}

startServer();
