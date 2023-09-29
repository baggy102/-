import { DataTypes, Model } from "sequelize";
import sequelize from "./index";

interface NoticeAttributes {
  notice_id?: number;
  notice_writer: string;
  notice_title: string;
  notice_content: string;
  notice_date: Date;
  notice_hit: number;
}

export class Notice extends Model<NoticeAttributes> {
  public readonly notice_id!: number;
  public notice_writer: string;
  public notice_title: string;
  public notice_content: string;
  public notice_date: Date;
  public notice_hit: number;

  public static associations: {};
}

Notice.init(
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
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
    notice_hit: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  { sequelize, tableName: "notice", freezeTableName: true, timestamps: false }
);

export default Notice;
