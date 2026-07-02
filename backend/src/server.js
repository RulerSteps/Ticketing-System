const app = require('./app');
const sequelize = require('./config/database');

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('Connexion a la base de donnees etablie.');
  } catch (err) {
    console.error('Impossible de se connecter a la base de donnees:', err.message);
  }

  app.listen(PORT, () => {
    console.log(`Serveur backend demarre sur http://localhost:${PORT}`);
  });
}

start();
