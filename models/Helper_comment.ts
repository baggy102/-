import { DataTypes, Model } from "sequelize";
import sequelize from "./index";

interface CommentAttributes {
  helper_comment_id?: number;
  helper_comment_board_id: number;
  helper_comment_writer: string;
  helper_comment_content: string;
  helper_comment_date: Date;
}

export class Helper_comment extends Model<CommentAttributes> {
  public helper_comment_id!: number;
  public helper_comment_board_id: number;
  public helper_comment_writer: string;
  public helper_comment_content: string;
  public helper_comment_date: Date;

  public static associations: {};
}

Helper_comment.init(
  {
    helper_comment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    helper_comment_board_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    helper_comment_writer: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    helper_comment_content: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    helper_comment_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    sequelize,
    tableName: "helper_comment",
    freezeTableName: true,
    timestamps: false,
  }
);

export default Helper_comment;
