module.exports = (sequelize, DataTypes) => {
  const Ticket = sequelize.define(
    'Ticket',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      titre: { type: DataTypes.STRING(200), allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: false },
      statut: {
        type: DataTypes.ENUM('nouveau', 'assigne', 'en_cours', 'en_attente', 'resolu', 'ferme'),
        allowNull: false,
        defaultValue: 'nouveau',
      },
      priorite: {
        type: DataTypes.ENUM('critique', 'haute', 'moyenne', 'basse'),
        allowNull: false,
        defaultValue: 'moyenne',
      },
      categorie_id: { type: DataTypes.INTEGER, allowNull: true },
      createur_id: { type: DataTypes.INTEGER, allowNull: false },
      technicien_id: { type: DataTypes.INTEGER, allowNull: true },
      date_resolution: { type: DataTypes.DATE, allowNull: true },
      // Champs du module IA (analyse automatique a la creation, section 13 du CDC)
      ia_criticite: {
        type: DataTypes.ENUM('CRITIQUE', 'HAUTE', 'MOYENNE', 'BASSE'),
        allowNull: true,
      },
      ia_justification: { type: DataTypes.TEXT, allowNull: true },
      ia_score: { type: DataTypes.INTEGER, allowNull: true },
    },
    {
      tableName: 'tickets',
      timestamps: true,
      createdAt: 'date_creation',
      updatedAt: 'date_modification',
    }
  );

  Ticket.associate = (models) => {
    Ticket.belongsTo(models.Category, { foreignKey: 'categorie_id', as: 'categorie' });
    Ticket.belongsTo(models.User, { foreignKey: 'createur_id', as: 'createur' });
    Ticket.belongsTo(models.User, { foreignKey: 'technicien_id', as: 'technicien' });
    Ticket.hasMany(models.HistoriqueTicket, { foreignKey: 'ticket_id', as: 'historique' });
    Ticket.hasMany(models.Commentaire, { foreignKey: 'ticket_id', as: 'commentaires' });
    Ticket.hasMany(models.Notification, { foreignKey: 'ticket_id', as: 'notifications' });
  };

  return Ticket;
};
