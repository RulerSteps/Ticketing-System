module.exports = (sequelize, DataTypes) => {
  const Commentaire = sequelize.define(
    'Commentaire',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      ticket_id: { type: DataTypes.INTEGER, allowNull: false },
      utilisateur_id: { type: DataTypes.INTEGER, allowNull: false },
      contenu: { type: DataTypes.TEXT, allowNull: false },
    },
    {
      tableName: 'commentaires',
      timestamps: true,
      createdAt: 'date_creation',
      updatedAt: false,
    }
  );

  Commentaire.associate = (models) => {
    Commentaire.belongsTo(models.Ticket, { foreignKey: 'ticket_id', as: 'ticket' });
    Commentaire.belongsTo(models.User, { foreignKey: 'utilisateur_id', as: 'utilisateur' });
  };

  return Commentaire;
};
