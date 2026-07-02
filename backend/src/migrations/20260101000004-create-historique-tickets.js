module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('historique_tickets', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      ticket_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'tickets', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      utilisateur_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      ancien_statut: { type: Sequelize.STRING(50), allowNull: true },
      nouveau_statut: { type: Sequelize.STRING(50), allowNull: false },
      description_action: { type: Sequelize.TEXT, allowNull: true },
      date_action: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('historique_tickets');
  },
};
