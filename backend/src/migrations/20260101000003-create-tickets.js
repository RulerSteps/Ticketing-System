module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tickets', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      titre: { type: Sequelize.STRING(200), allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: false },
      statut: {
        type: Sequelize.ENUM('nouveau', 'assigne', 'en_cours', 'en_attente', 'resolu', 'ferme'),
        allowNull: false,
        defaultValue: 'nouveau',
      },
      priorite: {
        type: Sequelize.ENUM('critique', 'haute', 'moyenne', 'basse'),
        allowNull: false,
        defaultValue: 'moyenne',
      },
      categorie_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'categories', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      createur_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      technicien_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      date_resolution: { type: Sequelize.DATE, allowNull: true },
      ia_criticite: {
        type: Sequelize.ENUM('CRITIQUE', 'HAUTE', 'MOYENNE', 'BASSE'),
        allowNull: true,
      },
      ia_justification: { type: Sequelize.TEXT, allowNull: true },
      ia_score: { type: Sequelize.INTEGER, allowNull: true },
      date_creation: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      date_modification: { type: Sequelize.DATE, allowNull: true },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('tickets');
  },
};
