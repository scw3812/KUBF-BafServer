const Sequelize = require('sequelize');

module.exports = class Post extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      title: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: false,
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: false,
      },
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'Post',
      tableName: 'posts',
      paranoid: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  }
  
  static associate(db) {
    db.Post.hasMany(db.Comment, { as: 'comments', foreignKey: 'postId', sourceKey: 'id', onDelete: 'cascade' });
    db.Post.belongsTo(db.User, { as: 'user', foreignKey: 'userId', targetKey: 'id' });
    db.Post.belongsTo(db.Category, { as: 'category', foreignKey: 'categoryId', targetKey: 'id' });
  }
}