"use strict";

const Sequelize = require("sequelize");
const config = require(__dirname + "/../config/config.json")["development"];
const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User_info = require("./User_info")(sequelize, Sequelize);
db.Wanter_board = require("./Wanter_board")(sequelize, Sequelize);
db.Wanter_comment = require("./Wanter_comment")(sequelize, Sequelize);
db.Helper_board = require("./Helper_board")(sequelize, Sequelize);
db.Helper_comment = require("./Helper_comment")(sequelize, Sequelize);
db.Notice = require("./Notice")(sequelize, Sequelize);
db.Who_wanter_like = require("./Who_wanter_like")(sequelize, Sequelize);
db.Who_helper_like = require("./Who_helper_like")(sequelize, Sequelize);

db.User_info.hasMany(db.Wanter_board, {
  foreignKey: "wanter_board_writer",
  sourceKey: "user_name",
});
db.Wanter_board.belongsTo(db.User_info, {
  foreignKey: "wanter_board_writer",
  targetKey: "user_name",
  onDelete: "cascade",
  onUpdate: "cascade",
});

db.User_info.hasMany(db.Wanter_comment, {
  foreignKey: "wanter_comment_writer",
  sourceKey: "user_name",
});
db.Wanter_comment.belongsTo(db.User_info, {
  foreignKey: "wanter_comment_writer",
  targetKey: "user_name",
  onDelete: "cascade",
  onUpdate: "cascade",
});

db.User_info.hasMany(db.Helper_board, {
  foreignKey: "helper_board_writer",
  sourceKey: "user_name",
});
db.Helper_board.belongsTo(db.User_info, {
  foreignKey: "helper_board_writer",
  targetKey: "user_name",
  onDelete: "cascade",
  onUpdate: "cascade",
});

db.User_info.hasMany(db.Helper_comment, {
  foreignKey: "helper_comment_writer",
  sourceKey: "user_name",
});
db.Helper_comment.belongsTo(db.User_info, {
  foreignKey: "helper_comment_writer",
  targetKey: "user_name",
  onDelete: "cascade",
  onUpdate: "cascade",
});

db.Wanter_board.hasMany(db.Wanter_comment, {
  foreignKey: "wanter_comment_board_id",
  sourceKey: "wanter_board_id",
});
db.Wanter_comment.belongsTo(db.Wanter_board, {
  foreignKey: "wanter_comment_board_id",
  sourceKey: "wanter_board_id",
  onUpdate: "cascade",
  onDelete: "cascade",
});

db.Helper_board.hasMany(db.Helper_comment, {
  foreignKey: "helper_comment_board_id",
  sourceKey: "helper_board_id",
});
db.Helper_comment.belongsTo(db.Helper_board, {
  foreignKey: "helper_comment_board_id",
  sourceKey: "helper_board_id",
  onUpdate: "cascade",
  onDelete: "cascade",
});

db.User_info.hasMany(db.Notice, {
  foreignKey: "notice_writer",
  sourceKey: "user_name",
});
db.Notice.belongsTo(db.User_info, {
  foreignKey: "notice_writer",
  targetKey: "user_name",
  onDelete: "cascade",
  onUpdate: "cascade",
});

db.User_info.hasMany(db.Who_wanter_like, {
  foreignKey: "who_user_name",
  sourceKey: "user_name",
});
db.Who_wanter_like.belongsTo(db.User_info, {
  foreignKey: "who_user_name",
  targetKey: "user_name",
  onDelete: "cascade",
  onUpdate: "cascade",
});
db.Wanter_board.hasMany(db.Who_wanter_like, {
  foreignKey: "where_wanter_board_id",
  sourceKey: "wanter_board_id",
});
db.Who_wanter_like.belongsTo(db.Wanter_board, {
  foreignKey: "where_wanter_board_id",
  targetKey: "wanter_board_id",
  onDelete: "cascade",
  onUpdate: "cascade",
});

db.User_info.hasMany(db.Who_helper_like, {
  foreignKey: "who_user_name",
  sourceKey: "user_name",
});
db.Who_helper_like.belongsTo(db.User_info, {
  foreignKey: "who_user_name",
  targetKey: "user_name",
  onDelete: "cascade",
  onUpdate: "cascade",
});
db.Helper_board.hasMany(db.Who_helper_like, {
  foreignKey: "where_helper_board_id",
  sourceKey: "helper_board_id",
  onDelete: "cascade",
  onUpdate: "cascade",
});
db.Who_helper_like.belongsTo(db.Helper_board, {
  foreignKey: "where_helper_board_id",
  targetKey: "helper_board_id",
  onDelete: "cascade",
  onUpdate: "cascade",
});

db.User_info.belongsToMany(db.User_info, {
  foreignKey: "followingId", // user1에게 생기는 following
  as: "Followers", // 생성된 Follow라는 테이블을 이름을 바꿔서 가져옴 - user.getFollowers, user.getFollowings 같은 관계 메소드 사용 가능
  // include 시에도 as에 넣은 값을 넣으면 관계 쿼리가 작동함
  through: "Follow", // 생성할 테이블 이름 , 유저-테이블 -유저, 특정 유저의 팔로잉/팔로워 목록이 저장됨
  onDelete: "cascade",
  onUpdate: "cascade",
});
db.User_info.belongsToMany(db.User_info, {
  foreignKey: "followerId", // user2에게 생기는 follower
  as: "Followings",
  through: "Follow",
  onDelete: "cascade",
  onUpdate: "cascade",
});

module.exports = db;
