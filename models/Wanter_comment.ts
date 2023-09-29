import { DataTypes, Model } from "sequelize";
import sequelize from "./index";

interface CommentAttributes {
  wanter_comment_id?: number;
  wanter_comment_board_id: number;
  wanter_comment_writer: string;
  wanter_comment_content: string;
  wanter_comment_date: Date;
}

export class Wanter_comment extends Model<CommentAttributes> {
  public wanter_comment_id!: number;
  public wanter_comment_board_id: number;
  public wanter_comment_writer: string;
  public wanter_comment_content: string;
  public wanter_comment_date: Date;

  public static associations: {};
}

Wanter_comment.init(
  {
    wanter_comment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    wanter_comment_board_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    wanter_comment_writer: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    wanter_comment_content: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    wanter_comment_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    sequelize,
    tableName: "wanter_comment",
    freezeTableName: true,
    timestamps: false,
  }
);

export default Wanter_comment;
