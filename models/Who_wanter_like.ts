import { DataTypes, Model } from "sequelize";
import sequelize from "./index";

interface LikeAttributes {
  wanter_like_id?: number;
  where_wanter_board_id: number;
  who_user_name: string;
}

export class Who_wanter_like extends Model<LikeAttributes> {
  public readonly wanter_like_id!: number;
  public where_wnater_board_id: number;
  public who_user_name: string;

  public static associations: {};
}

Who_wanter_like.init(
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
    sequelize,
    tableName: "who_wanter_like",
    freezeTableName: true,
    timestamps: false,
  }
);

export default Who_wanter_like;
