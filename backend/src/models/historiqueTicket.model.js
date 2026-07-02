module.exports = (sequelize, DataTypes) => {
  const HistoriqueTicket = sequelize.define(
    'HistoriqueTicket',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      ticket_id: { type: DataTypes.INTEGER, allowNull: false },
      utilisateur_id: { type: DataTypes.INTEGER, allowNull: false },
      ancien_statut: { type: DataTypes.STRING(50), allowNull: true },
      nouveau_statut: { type: DataTypes.STRING(50), allowNull: false },
      description_action: { type: DataTypes.TEXT, allowNull: true },
    },
    {
      tableName: 'historique_tickets',
      timestamps: true,
      createdAt: 'date_action',
      updatedAt: false,
    }
  );

  HistoriqueTicket.associate = (models) => {
    HistoriqueTicket.belongsTo(models.Ticket, { foreignKey: 'ticket_id', as: 'ticket' });
    HistoriqueTicket.belongsTo(models.User, { foreignKey: 'utilisateur_id', as: 'utilisateur' });
  };

  return HistoriqueTicket;
};
