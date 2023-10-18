import express, { RequestHandler } from "express";
import session from "express-session";
import multer from "multer";
import config from "../config/config.json";

const Errands = require("../models");
const { Op } = require("sequelize");
const mysql = require("mysql2");

const conn = mysql
  .createPool({
    host: config.development.host,
    user: config.development.username,
    password: config.development.password,
    database: config.development.database,
  })
  .promise();

// ======= Wanter_board =======
// 매인페이지에 5개 보여주기 deadline순 5개
export const read_few_wanter_board: RequestHandler = async (req, res) => {
  try {
    const sql =
      "SELECT * FROM wanter_board order by wanter_board_dead_line DESC LIMIT 5";
    const [rows] = await conn.query(sql);
    res.send(rows);
  } catch (err) {
    res.send(err);
  }
};

// 전체 다 보여주기
export const read_wanter_board: RequestHandler = async (req, res) => {
  try {
    const sql = "SELECT * FROM wanter_board order by wanter_board_date ASC";
    const [rows] = await conn.query(sql);
    res.send(rows);
  } catch (err) {
    res.send(err);
  }
};

// 게시물 하나만 보여주기
export const read_one_wanter_board: RequestHandler = async (req, res) => {
  try {
    const header = req.params;
    const params: any[] = [header.boardId];
    const sql: string = "SELECT * FROM wanter_board WHERE wanter_board_id = ?";
    const [rows] = await conn.query(sql, params);
    res.send(rows);
  } catch (err) {
    res.send(err);
  }
};

// 게시물 생성
export const create_wanter_board: RequestHandler = async (req, res) => {
  try {
    const body = req.body;
    if (!req.session.user_info) {
      res.send("로그인하시오");
    } else {
      const params: any[] = [
        req.session.user_info.user_name,
        body.wanter_board_title,
        body.wanter_board_content,
        body.wanter_board_place,
        body.wanter_board_dead_line,
        body.wanter_board_place_detail,
        false,
      ];
      const createBoardSql: string =
        "INSERT INTO wanter_board (wanter_board_writer, wanter_board_title, wanter_board_content, wanter_board_place, wanter_board_dead_line, wanter_board_place_detail,wanter_board_done) VALUES(?, ?, ?, ?, ?);";
      const [rows] = await conn.query(createBoardSql, params);
      res.send(rows);
    }
  } catch (err) {
    res.send(err);
  }
};

// 게시물 수정
export const update_wanter_board: RequestHandler = async (req, res) => {
  try {
    const header = req.params;
    const params: any[] = [header.boardId];
    const authSql =
      "SELECT * FROM wanter_board WHERE wanter_board_id = ? LIMIT 1";
    const body = req.body;
    const updateParams: any[] = [
      body.wanter_board_title,
      body.wanter_board_content,
      body.wanter_board_place,
      body.wanter_board_done,
    ];
    const updateSql =
      "UPDATE wanter_board SET wanter_board_title = ?, wanter_board_content = ?, wanter_board_place = ?, wanter_board_done = ? WHERE wanter_board_id = ?";

    if (!req.session.user_info) {
      res.send("로그인하시오");
    } else {
      const [auth] = await conn.query(authSql, params);
      if (auth[0].wanter_board_writer !== req.session.user_info.user_name) {
        res.send("작성자만 수정 가능");
      } else {
        const [result] = await conn.query(updateSql, updateParams, params);
        if (result[0] === 0) {
          return res.send(false);
        }
        res.send(true);
      }
    }
  } catch (err) {
    res.send(err);
  }
};

// 게시물 삭제
export const delete_wanter_board: RequestHandler = async (req, res) => {
  try {
    const header = req.params;
    const params: any[] = [header.boardId];
    const sql =
      "SELECT wanter_board_writer FROM wanter_board WHERE wanter_board_id = ? LIMIT 1";
    const deleteSql = "DELETE FROM wanter_board WHERE wanter_board_id = ?";
    if (!req.session.user_info) {
      res.send("로그인하세욤");
    } else {
      const [auth] = await conn.query(sql, params);
      if (auth[0].wanter_board_writer !== req.session.user_info.user_name) {
        res.send("작성자만 삭제 가능");
      } else {
        const [result] = await conn.query(deleteSql, params);
        if (!result[0]) {
          return res.send(false);
        }
        res.send(true);
      }
    }
  } catch (err) {
    res.send(err);
  }
};

// 조회수 up
export const hit_wanter_board: RequestHandler = async (req, res) => {
  try {
    const header = req.params;
    const sql: string =
      "UPDATE wanter_board SET wanter_board_hit = wanter_board_hit + 1 WHERE wanter_board_id = ?";
    const params: any[] = [header.boardId];
    const [rows] = await conn.query(sql, params);
    res.send(rows);
  } catch (err) {
    res.send(err);
  }
};

// 검색
export const search_wanter_board: RequestHandler = async (req, res) => {
  try {
    const { boardType, optionValue } = req.params;
    const search = req.query.search;
    if (boardType == "wanter") {
      if (optionValue == "wanter_board_writer") {
        const result = await Errands.Wanter_board.findAll({
          where: {
            wanter_board_writer: { [Op.like]: `%${search}%` },
          },
        });
        res.send(result);
      } else if (optionValue === "wanter_board_title") {
        const result = await Errands.Wanter_board.findAll({
          where: {
            wanter_board_title: { [Op.like]: `%${search}%` },
          },
        });
        res.send(result);
      } else if (optionValue === "wanter_board_place") {
        const result = await Errands.Wanter_board.findAll({
          where: {
            wanter_board_place: { [Op.like]: `%${search}%` },
          },
        });
        res.send(result);
      }
    } else if (boardType == "helper") {
      if (optionValue == "helper_board_writer") {
        const result = await Errands.Helper_board.findAll({
          where: {
            helper_board_writer: { [Op.like]: `%${search}%` },
          },
        });
        res.send(result);
      } else if (optionValue === "helper_board_title") {
        const result = await Errands.Helper_board.findAll({
          where: {
            helper_board_title: { [Op.like]: `%${search}%` },
          },
        });
        res.send(result);
      } else if (optionValue === "wanter_board_place") {
        const result = await Errands.Helper_board.findAll({
          where: {
            helper_board_place: { [Op.like]: `%${search}%` },
          },
        });
        res.send(result);
      }
    } else {
      res.send("알 수 없는 오류");
    }
  } catch (err) {
    res.send(err);
  }
};

// 게시물 done, proceeding params -> session 변경

// 게시물 done 처리
export const done_wanter_board: RequestHandler = async (req, res) => {
  try {
    const header = req.params;
    const params: any[] = [header.boardId];
    const sql =
      "SELECT wanter_board_writer FROM wanter_board WHERE wanter_board_id = ? LIMIT 1";
    const updateDoneSql: string =
      "UPDATE wanter_board SET wanter_board_done = true WHERE wanter_board_id = ?";
    if (!req.session.user_info) {
      res.send("로그인하시오");
    } else {
      const [auth] = await conn.query(sql, params);
      if (auth[0].wanter_board_writer !== req.session.user_info.user_name) {
        res.send("작성자만 완료가능");
      } else {
        const [result] = await conn.qeury(updateDoneSql, params);
        if (result[0] === 0) {
          res.send(false);
        } else {
          res.send(true);
        }
      }
    }
  } catch (err) {
    res.send(err);
  }
};

export const wanter_board_like: RequestHandler = async (req, res) => {
  try {
    const header = req.params;
    const params: any[] = [header.boardId, req.session.user_info.user_name];
    const sql =
      "SELECT * FROM who_wanter_like WHERE where_wanter_board_id = ?, who_user_name = ? LIMIT 1";
    const createSql =
      "INSERT INTO who_wanter_like (where_wnater_board_id, who_user_name) VALUES (?, ?)";
    const likeSql: string =
      "UPDATE wanter_board SET wanter_board_like = wanter_board_like + 1 WHERE wanter_board_id = ?";
    const [auth] = await conn.query(sql, params);
    if (!auth[0]) {
      await conn.query(createSql, params);
      await conn.query(likeSql, params[0]);
      res.send(true);
    } else {
      res.send(false); // 이미 좋아요 누른 게시글입니다
    }
  } catch (err) {
    res.send(err);
  }
};
