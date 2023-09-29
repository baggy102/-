import { DataTypes, Model } from "sequelize";
import sequelize from "./index";

interface HelperBoardAttributes {
  helper_board_id?: number;
  helper_board_writer: string;
  helper_board_title: string;
  helper_board_content: string;
  helper_board_place: string;
  helper_board_place_detail: string;
  helper_board_dead_line: string;
  helper_board_date: Date;
  helper_board_hit: number;
  helper_board_like: number;
  helper_board_done: number;
}

export class Helper_board extends Model<HelperBoardAttributes> {
  public readonly helper_board_id!: number;
  public helper_board_writer: string;
  public helper_board_title: string;
  public helper_board_content: string;
  public helper_board_place: string;
  public helper_board_place_detail: string;
  public helper_board_dead_line: string;
  public helper_board_date: Date;
  public helper_board_hit: number;
  public helper_board_like: number;
  public helper_board_done: number;

  public static associations: {};
}

Helper_board.init(
  {
    helper_board_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    helper_board_writer: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    helper_board_title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    helper_board_content: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    helper_board_place: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    helper_board_place_detail: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "",
    },
    helper_board_dead_line: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    helper_board_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
    helper_board_hit: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    helper_board_like: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    helper_board_done: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: "helper_board",
    freezeTableName: true,
    timestamps: false,
  }
);

export default Helper_board;
