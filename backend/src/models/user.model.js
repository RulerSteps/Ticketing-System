const { ROLES } = require('../constants/roles');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      nom: { type: DataTypes.STRING(100), allowNull: false },
      email: { type: DataTypes.STRING(150), allowNull: false, unique: true, validate: { isEmail: true } },
      mot_de_passe: { type: DataTypes.STRING(255), allowNull: false },
      role: {
        type: DataTypes.ENUM(...Object.values(ROLES)),
        allowNull: false,
        defaultValue: ROLES.UTILISATEUR,
      },
      actif: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      tentatives_echouees: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      bloque_jusqua: { type: DataTypes.DATE, allowNull: true },
    },
    {
      tableName: 'users',
      timestamps: true,
      createdAt: 'date_creation',
      updatedAt: 'date_modification',
    }
  );

  User.associate = (models) => {
    User.hasMany(models.Ticket, { foreignKey: 'createur_id', as: 'tickets_crees' });
    User.hasMany(models.Ticket, { foreignKey: 'technicien_id', as: 'tickets_assignes' });
    User.hasMany(models.HistoriqueTicket, { foreignKey: 'utilisateur_id', as: 'actions' });
    User.hasMany(models.Commentaire, { foreignKey: 'utilisateur_id', as: 'commentaires' });
    User.hasMany(models.Notification, { foreignKey: 'utilisateur_id', as: 'notifications' });
  };

  return User;
};
