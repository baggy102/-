import { DataTypes, Model } from "sequelize";
import sequelize from "./index";

interface UsersAttributes {
  id?: number; //? id는 not null autoincrement로 ?를 이용해 와일드 카드 적용.
  user_id: string;
  user_pw: string;
  user_name: string;
  user_type: string;
  user_like: number;
  user_img: string;
}

export class User_info extends Model<UsersAttributes> {
  //? 조회 후 사용 되어질 요소들의 타입명시 설정이 되어 있지 않으면 조회시 또는 조회 후 데이터 타입체크에서 오류
  public readonly id!: number;
  public user_id!: string;
  public user_pw: string;
  public user_name: string;
  public user_type: string;
  public user_like: number;
  public user_img: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static associations: {};
}

User_info.init(
  {
    user_id: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    user_pw: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    user_name: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: true,
    },
    user_type: {
      type: DataTypes.STRING(4),
      allowNull: true,
    },
    user_like: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    user_img: {
      type: DataTypes.STRING(1000),
      allowNull: false,
      defaultValue: "default.png",
    },
  },
  {
    tableName: "user_info",
    sequelize, //? 생성한 Sequelize 객체 패싱
    freezeTableName: true,
    timestamps: false,
  }
);

export default User_info;
