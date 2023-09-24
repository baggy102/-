const Wanter_board = function (Sequelize, DataTypes) {
  const model = Sequelize.define(
    "wanter_board",
    {
      wanter_board_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      wanter_board_writer: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      wanter_board_title: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      wanter_board_content: {
        type: DataTypes.STRING(1000),
        allowNull: false,
      },
      wanter_board_place: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      wanter_board_place_detail: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: "",
      },
      wanter_board_dead_line: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      wanter_board_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      wanter_board_hit: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      wanter_board_like: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      wanter_board_done: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    { tableName: "wanter_board", freezeTableName: true, timestamps: false }
  );
  return model;
};

module.exports = Wanter_board;
