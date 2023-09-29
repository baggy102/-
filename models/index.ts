"use strict";
import { DataTypes, Model } from "sequelize";
import { Sequelize } from "sequelize";
import config from "../config/config.json";
import User_info from "./User_info";
import Wanter_board from "./Wanter_board";
import Wanter_comment from "./Wanter_comment";
import Helper_board from "./Helper_board";
import Helper_comment from "./Helper_comment";
import Who_wanter_like from "./Who_wanter_like";
import Who_helper_like from "./Who_helper_like";
import Notice from "./Notice";

const sequelize = new Sequelize(
  config.development.database,
  config.development.username,
  config.development.password
);

User_info.hasMany(Wanter_board, {
  foreignKey: "wanter_board_writer",
  sourceKey: "user_name",
});
Wanter_board.belongsTo(User_info, {
  foreignKey: "wanter_board_writer",
  targetKey: "user_name",
  onDelete: "cascade",
  onUpdate: "cascade",
});

User_info.hasMany(Wanter_comment, {
  foreignKey: "wanter_comment_writer",
  sourceKey: "user_name",
});
Wanter_comment.belongsTo(User_info, {
  foreignKey: "wanter_comment_writer",
  targetKey: "user_name",
  onDelete: "cascade",
  onUpdate: "cascade",
});

User_info.hasMany(Helper_board, {
  foreignKey: "helper_board_writer",
  sourceKey: "user_name",
});
Helper_board.belongsTo(User_info, {
  foreignKey: "helper_board_writer",
  targetKey: "user_name",
  onDelete: "cascade",
  onUpdate: "cascade",
});

User_info.hasMany(Helper_comment, {
  foreignKey: "helper_comment_writer",
  sourceKey: "user_name",
});
Helper_comment.belongsTo(User_info, {
  foreignKey: "helper_comment_writer",
  targetKey: "user_name",
  onDelete: "cascade",
  onUpdate: "cascade",
});

Wanter_board.hasMany(Wanter_comment, {
  foreignKey: "wanter_comment_board_id",
  sourceKey: "wanter_board_id",
});
Wanter_comment.belongsTo(Wanter_board, {
  foreignKey: "wanter_comment_board_id",
  targetKey: "wanter_board_id",
  onUpdate: "cascade",
  onDelete: "cascade",
});

Helper_board.hasMany(Helper_comment, {
  foreignKey: "helper_comment_board_id",
  sourceKey: "helper_board_id",
});
Helper_comment.belongsTo(Helper_board, {
  foreignKey: "helper_comment_board_id",
  targetKey: "helper_board_id",
  onUpdate: "cascade",
  onDelete: "cascade",
});

User_info.hasMany(Notice, {
  foreignKey: "notice_writer",
  sourceKey: "user_name",
});
Notice.belongsTo(User_info, {
  foreignKey: "notice_writer",
  targetKey: "user_name",
  onDelete: "cascade",
  onUpdate: "cascade",
});

User_info.hasMany(Who_wanter_like, {
  foreignKey: "who_user_name",
  sourceKey: "user_name",
});
Who_wanter_like.belongsTo(User_info, {
  foreignKey: "who_user_name",
  targetKey: "user_name",
  onDelete: "cascade",
  onUpdate: "cascade",
});
Wanter_board.hasMany(Who_wanter_like, {
  foreignKey: "where_wanter_board_id",
  sourceKey: "wanter_board_id",
});
Who_wanter_like.belongsTo(Wanter_board, {
  foreignKey: "where_wanter_board_id",
  targetKey: "wanter_board_id",
  onDelete: "cascade",
  onUpdate: "cascade",
});

User_info.hasMany(Who_helper_like, {
  foreignKey: "who_user_name",
  sourceKey: "user_name",
});
Who_helper_like.belongsTo(User_info, {
  foreignKey: "who_user_name",
  targetKey: "user_name",
  onDelete: "cascade",
  onUpdate: "cascade",
});
Helper_board.hasMany(Who_helper_like, {
  foreignKey: "where_helper_board_id",
  sourceKey: "helper_board_id",
  onDelete: "cascade",
  onUpdate: "cascade",
});
Who_helper_like.belongsTo(Helper_board, {
  foreignKey: "where_helper_board_id",
  targetKey: "helper_board_id",
  onDelete: "cascade",
  onUpdate: "cascade",
});

User_info.belongsToMany(User_info, {
  foreignKey: "followingId", // user1에게 생기는 following
  as: "Followers", // 생성된 Follow라는 테이블을 이름을 바꿔서 가져옴 - user.getFollowers, user.getFollowings 같은 관계 메소드 사용 가능
  // include 시에도 as에 넣은 값을 넣으면 관계 쿼리가 작동함
  through: "Follow", // 생성할 테이블 이름 , 유저-테이블 -유저, 특정 유저의 팔로잉/팔로워 목록이 저장됨
  onDelete: "cascade",
  onUpdate: "cascade",
});
User_info.belongsToMany(User_info, {
  foreignKey: "followerId", // user2에게 생기는 follower
  as: "Followings",
  through: "Follow",
  onDelete: "cascade",
  onUpdate: "cascade",
});

export default sequelize;
