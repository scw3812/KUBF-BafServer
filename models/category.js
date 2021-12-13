const Sequelize = require('sequelize');

module.exports = class Post extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      name: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: false,
      },
    }, {
      sequelize,
      timestamps: false,
      underscored: false,
      modelName: 'Category',
      tableName: 'categories',
      paranoid: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  }
  
  static associate(db) {
    db.Category.hasMany(db.Post, { as: 'posts', foreignKey: 'categoryId', sourceKey: 'id', onDelete: 'cascade' });
  }
}