const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      email: {
        type: Sequelize.STRING(30),
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.CHAR(60),
        allowNull: true,
        unique: false
      },
      nickname: {
        type: Sequelize.STRING(10),
        allowNull: false,
        unique: true,
      },
      name: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: false,
      },
      isAdmin: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        unique: false,
      }
    }, {
      sequelize,
      timestamps: false,
      underscored: false,
      modelName: 'User',
      tableName: 'users',
      paranoid: false,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }
  
  static associate(db) {
    db.User.hasMany(db.Post, { as: 'posts', foreignKey: 'userId', sourceKey: 'id', onDelete: 'cascade' });
    db.User.hasMany(db.Comment, { as: 'comments', foreignKey: 'userId', sourceKey: 'id', onDelete: 'cascade' });
  }
}