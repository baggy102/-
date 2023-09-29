import { DataTypes, Model } from "sequelize";
import sequelize from "./index";

interface WanterBoardAttributes {
  wanter_board_id?: number;
  wanter_board_writer: string;
  wanter_board_title: string;
  wanter_board_content: string;
  wanter_board_place: string;
  wanter_board_place_detail: string;
  wanter_board_dead_line: string;
  wanter_board_date: Date;
  wanter_board_hit: number;
  wanter_board_like: number;
  wanter_board_done: number;
}

export class Wanter_board extends Model<WanterBoardAttributes> {
  public readonly wanter_board_id!: number;
  public wanter_board_writer: string;
  public wanter_board_title: string;
  public wanter_board_content: string;
  public wanter_board_place: string;
  public wanter_board_place_detail: string;
  public wanter_board_dead_line: string;
  public wanter_board_date: Date;
  public wanter_board_hit: number;
  public wanter_board_like: number;
  public wanter_board_done: number;

  public static associations: {};
}

Wanter_board.init(
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
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
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
  {
    sequelize,
    tableName: "wanter_board",
    freezeTableName: true,
    timestamps: false,
  }
);

export default Wanter_board;
