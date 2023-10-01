const Who_helper_like = function (Sequelize, DataTypes) {
  const model = Sequelize.define(
    "who_helper_like",
    {
      helper_like_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      where_helper_board_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      who_user_name: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
    },
    {
      tableName: "who_helper_like",
      freezeTableName: true,
      timestamps: false,
    }
  );
  return model;
};

module.exports = Who_helper_like;
