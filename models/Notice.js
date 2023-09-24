const Notice = function (Sequelize, DataTypes) {
  const model = Sequelize.define(
    "notice",
    {
      notice_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      notice_writer: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      notice_title: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      notice_content: {
        type: DataTypes.STRING(1000),
        allowNull: false,
      },
      notice_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      notice_hit: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    { tableName: "notice", freezeTableName: true, timestamps: false }
  );
  return model;
};

module.exports = Notice;
