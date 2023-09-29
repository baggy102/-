import { DataTypes, Model } from "sequelize";
import sequelize from "./index";

interface LikeAttributes {
  helper_like_id?: number;
  where_helper_board_id: number;
  who_user_name: string;
}

export class Who_helper_like extends Model<LikeAttributes> {
  public readonly helper_like_id!: number;
  public where_helper_board_id: number;
  public who_user_name: string;

  public static associations: {};
}

Who_helper_like.init(
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
    sequelize,
    tableName: "who_helper_like",
    freezeTableName: true,
    timestamps: false,
  }
);

export default Who_helper_like;
