import express, { RequestHandler } from "express";
import session from "express-session";
import config from "../config/config.json";
import { conn } from "../config/mysql";

const mysql = require("mysql2");

export const userLogin: RequestHandler = async (req, res) => {
  // #swagger.tags = ['Users']
  try {
    const body = req.body;
    const sql: string =
      "SELECT * FROM user_info WHERE user_id = ? && user_pw = ?";
    const params: any[] = [body.user_id, body.user_pw];
    const [rows] = await conn.query(sql, params);
    if (rows[0] != null) {
      req.session.user_info = rows[0];
      res.send({ user_info: rows[0], msg: true });
    } else {
      res.send(false);
    }
  } catch (err) {
    res.send(err);
  }
};

export const checkUserId: RequestHandler = async (req, res) => {
  // #swagger.tags = ['Users']
  try {
    const body = req.body;
    const sql: string =
      "SELECT user_id FROM user_info WHERE user_id = ? LIMIT 1";
    const params: any[] = [body.user_id];
    const [rows] = await conn.query(sql, params);
    if (!rows[0]) {
      return res.send(true);
    } else {
      return res.send(false);
    }
  } catch (err) {
    res.send(err);
  }
};

// 닉네임 중복검사
export const checkUserName: RequestHandler = async (req, res) => {
  // #swagger.tags = ['Users']
  try {
    const body = req.body;
    const sql: string =
      "SELECT user_name FROM user_info WHERE user_name = ? LIMIT 1";
    const params: any[] = [body.user_name];
    const [rows] = await conn.query(sql, params);

    if (!rows[0]) {
      return res.send(false);
    } else {
      return res.send(true);
    }
  } catch (err) {
    res.send(err);
  }
};

// 회원가입
export const userRegister: RequestHandler = async (req, res) => {
  // #swagger.tags = ['Users']
  try {
    const body = req.body;
    const sql: string =
      "SELECT user_id FROM user_info WHERE user_id = ? LIMIT 1";
    const params: any[] = [
      body.user_id,
      body.user_pw,
      body.user_name,
      body.user_type,
    ];
    const createUserSql: string =
      "INSERT INTO user_info (user_id, user_pw, user_name, user_type) VALUES(?, ?, ?, ?);";
    const [rows] = await conn.query(sql, params[0]);
    if (!rows[0]) {
      await conn.query(createUserSql, params);
      res.send(true);
    } else {
      res.send(false);
    }
  } catch (err) {
    res.send(err);
  }
};

// 로그아웃
export const userLogout: RequestHandler = async (req, res) => {
  // #swagger.tags = ['Users']
  try {
    console.log(req.session);
    req.session.destroy((err: Error) => {
      if (err) {
        throw err;
      }
      console.log("로그아웃 여부");
      console.log(req.session);
      res.send(true);
    });
  } catch (err) {
    res.send(err);
  }
};

// 메인페이지 상위 5명 보여주기
export const read_few_user: RequestHandler = async (req, res) => {
  // #swagger.tags = ['Users']
  try {
    const [rows] = await conn.query(
      "SELECT * FROM user_info ORDER BY user_like DESC LIMIT 5"
    );
    res.send(rows[0]);
  } catch (err) {
    res.send(err);
  }
};
// 전체 다 보여주기
export const read_user: RequestHandler = async (req, res) => {
  // #swagger.tags = ['Users']
  try {
    const [rows] = await conn.query(
      "SELECT * FROM user_info ORDER BY user_like DESC LIMIT 5"
    );
    res.send(rows);
  } catch (err) {
    res.send(err);
  }
};

// detail
export const read_detail_user: RequestHandler = async (req, res) => {
  // #swagger.tags = ['Users']
  try {
    const header = req.params;
    const sql: string = "SELECT * FROM user_info WHERE id = ? LIMIT 1";
    const params: any[] = [header.user];
    const [rows] = await conn.query(sql, params);
    res.send(rows[0]);
  } catch (err) {
    res.send(err);
  }
};

// 추천수s
// export const userLike: RequestHandler = async (req, res) => {
//   // #swagger.tags = ['Users']
//   try {
//     const header = req.params;
//     const sql: string = `UPDATE User_info SET user_like = user_like + 1 WHERE id = ?`;
//     const params: any[] = [header.user];
//     const [rows] = await conn.query(sql, params);
//     res.send(rows);
//   } catch (err) {
//     res.send(err);
//   }
// };

export const userLike: RequestHandler = async (req, res) => {
  // #swagger.tags = ['Users']
  try {
    if (!req.session.checkLiked) {
      req.session.checkLiked = true;
      req.session.checkLikedExpires = Date.now() + 60 * 60 * 24 * 1000;

      const header = req.params;
      const sql: string = `UPDATE User_info SET user_like = user_like + 1 WHERE id = ?`;
      const params: any[] = [header.user];
      const [rows] = await conn.query(sql, params);
      res.send(rows);
    } else {
      res.send("오늘 이미 추천하셨습니다.");
    }
  } catch (err) {
    res.send(err);
  }
};

// 회원탈퇴
export const userWithdrawal: RequestHandler<{
  user_name: string;
  userId: string;
}> = async (req, res) => {
  // #swagger.tags = ['Users']
  try {
    const header = req.params;
    const sql: string = "SELECT user_name FROM user_info WHERE id = ? LIMIT 1";
    const params: any[] = [header.userId];
    const [rows] = await conn.query(sql, params);
    if (rows[0].user_name == req.session.user_info.user_name) {
      const deleteUserParams: string = "DELETE FROM user_info WHERE id = ?";
      const [delRows] = await conn.query(deleteUserParams, params);
      if (!delRows) {
        res.send(false);
      } else {
        req.session.destroy((err: Error) => {
          if (err) {
            throw err;
          }
          res.send(true);
        });
      }
    }
  } catch (err) {
    res.send(err);
  }
};

// 회원정보 수정
export const userUpdate: RequestHandler = async (req, res) => {
  // #swagger.tags = ['Users']
  try {
    const userConfig = req.session.user_info;
    const params: any[] = [userConfig.user_name];
    const sql: string =
      "SELECT user_name FROM user_info WHERE user_name = ? LIMIT 1";
    const [auth] = await conn.query(sql, params);
    console.log(auth[0]);

    if (auth[0].user_name == userConfig.user_name) {
      const body = req.body;
      const header = req.params;
      const headParams: any[] = [header.userId];
      const updateParams: any[] = [
        body.user_id,
        body.user_pw,
        body.user_name,
        body.user_type,
      ];
      const updateSql: string =
        "UPDATE user_info SET user_id = ?, user_pw = ?, user_name = ?, user_type = ? WHERE id = ?";
      const [rows] = await conn.query(updateSql, updateParams, headParams);
      console.log(rows);
      if (rows === 0) {
        console.log(rows);
        return res.send(false);
      } else {
        res.send(true);
      }
    }
  } catch (err) {
    res.send(err);
  }
};

export const user_wanter_board: RequestHandler = async (req, res) => {
  // #swagger.tags = ['Users']
  try {
    const body = req.body;
    const params: any[] = [body.user_name];
    const sql = "SELECT * FROM wanter_board WHERE wanter_board_writer = ?";
    const [rows] = await conn.query(sql, params);
    res.send(rows);
  } catch (err) {
    res.send(err);
  }
};

export const user_helper_board: RequestHandler = async (req, res) => {
  // #swagger.tags = ['Users']
  try {
    const body = req.body;
    const params: any[] = [body.user_name];
    const sql = "SELECT * FROM helper_board WHERE helper_board_writer = ?";
    const [rows] = await conn.query(sql, params);
    res.send(rows);
  } catch (err) {
    res.send(err);
  }
};

export const set_user_img: RequestHandler = async (req, res) => {
  // #swagger.tags = ['Users']
  try {
    const updateFile = req.file;
    const header = req.params;
    const params: any[] = [updateFile.filename, header.user];
    const sql: string = "UPDATE user_info SET user_img = ? WHERE id = ?";
    const [rows] = await conn.query(sql, params);
    console.log(rows[0]);
    if (rows[0] === 0) {
      return res.send(false);
    } else {
      res.send(true);
    }
  } catch (err) {
    res.send(err);
  }
};

export const user_like: RequestHandler = async (req, res) => {
  // #swagger.tags = ['Users']
  try {
    if (!req.session.user_info) {
      const header = req.params;
      const params = header.user;
      const sql = "SELECT * FROM user_info WHERE id = ? LIMIT 1";
      const [search] = await conn.query(sql, params);
      if (!search) {
        res.send("오류임 모름이건");
      } else {
        search.addFollowing(parseInt(req.params.user, 10));
        res.send(true);
      }
    } else {
      res.send("로그인하시오");
    }
  } catch (err) {
    res.send(err);
  }
};
