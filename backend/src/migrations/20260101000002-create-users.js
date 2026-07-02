module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      nom: { type: Sequelize.STRING(100), allowNull: false },
      email: { type: Sequelize.STRING(150), allowNull: false, unique: true },
      mot_de_passe: { type: Sequelize.STRING(255), allowNull: false },
      role: {
        type: Sequelize.ENUM('administrateur', 'technicien', 'utilisateur'),
        allowNull: false,
        defaultValue: 'utilisateur',
      },
      actif: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      tentatives_echouees: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      bloque_jusqua: { type: Sequelize.DATE, allowNull: true },
      date_creation: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      date_modification: { type: Sequelize.DATE, allowNull: true },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('users');
  },
};
