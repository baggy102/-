const Who_wanter_like = function (Sequelize, DataTypes) {
  const model = Sequelize.define(
    "who_wanter_like",
    {
      wanter_like_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      where_wanter_board_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      who_user_name: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
    },
    {
      tableName: "who_wanter_like",
      freezeTableName: true,
      timestamps: false,
    }
  );
  return model;
};

module.exports = Who_wanter_like;
