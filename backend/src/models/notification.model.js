module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define(
    'Notification',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      utilisateur_id: { type: DataTypes.INTEGER, allowNull: false },
      ticket_id: { type: DataTypes.INTEGER, allowNull: true },
      message: { type: DataTypes.STRING(255), allowNull: false },
      lu: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    },
    {
      tableName: 'notifications',
      timestamps: true,
      createdAt: 'date_creation',
      updatedAt: false,
    }
  );

  Notification.associate = (models) => {
    Notification.belongsTo(models.User, { foreignKey: 'utilisateur_id', as: 'utilisateur' });
    Notification.belongsTo(models.Ticket, { foreignKey: 'ticket_id', as: 'ticket' });
  };

  return Notification;
};
