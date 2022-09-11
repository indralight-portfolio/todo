const DataTypes = require("sequelize").DataTypes;
const _Todo = require("./todo");
const _User = require("./user");

function initModels(sequelize) {
  const Todo = _Todo(sequelize, DataTypes);
  const User = _User(sequelize, DataTypes);


  return {
    Todo,
    User,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
