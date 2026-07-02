module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    'Category',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      nom: { type: DataTypes.STRING(100), allowNull: false, unique: true },
      description: { type: DataTypes.STRING(255), allowNull: true },
    },
    {
      tableName: 'categories',
      timestamps: true,
      createdAt: 'date_creation',
      updatedAt: false,
    }
  );

  Category.associate = (models) => {
    Category.hasMany(models.Ticket, { foreignKey: 'categorie_id', as: 'tickets' });
  };

  return Category;
};
