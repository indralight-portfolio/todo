const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return User.init(sequelize, DataTypes);
}

class User extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    nick: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    provider: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    sns_id: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'user',
    timestamps: false,
    freezeTableName: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "UKnqrwybr61j4tv0yjquumwxs2",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "email" },
          { name: "provider" },
        ]
      },
      {
        name: "UKob8kqyqqgmefl0aco34akdtpe",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "email" },
        ]
      },
    ]
  });
  }
}
