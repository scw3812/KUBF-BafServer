const Sequelize = require('sequelize');

module.exports = class Comment extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: false,
      },
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'Comment',
      tableName: 'comments',
      paranoid: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  }
  
  static associate(db) {
    db.Comment.belongsTo(db.User, { as: 'user', foreignKey: 'userId', targetKey: 'id' });
    db.Comment.belongsTo(db.Post, { as: 'post', foreignKey: 'postId', targetKey: 'id' });
  }
}