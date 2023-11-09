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

// ======= Helper_board =======
// 최신5개만 가져오기
export const read_few_helper_board: RequestHandler = async (req, res) => {
  // #swagger.tags = ['Helper_boards']
  try {
    const sql =
      "SELECT * FROM helper_board order by helper_board_date ASC LIMIT 3";
    const [rows] = await conn.query(sql);
    res.send(rows);
  } catch (err) {
    res.send(err);
  }
};

// 전체 다 가져오기
export const read_helper_board: RequestHandler = async (req, res) => {
  // #swagger.tags = ['Helper_boards']
  try {
    const sql = "SELECT * FROM helper_board order by helper_board_date ASC";
    const [rows] = await conn.query(sql);
    res.send(rows);
  } catch (err) {
    res.send(err);
  }
};

// 게시물 하나만 가져오기
export const read_one_helper_board: RequestHandler = async (req, res) => {
  // #swagger.tags = ['Helper_boards']
  try {
    const header = req.params;
    const params: any[] = [header.boardId];
    const sql: string = "SELECT * FROM helper_board WHERE helper_board_id = ?";
    const [rows] = await conn.query(sql, params);
    res.send(rows);
  } catch (err) {
    res.send(err);
  }
};

// 게시물 생성
export const create_helper_board: RequestHandler = async (req, res) => {
  // #swagger.tags = ['Helper_boards']
  try {
    const body = req.body;

    if (!req.session.user_info) {
      res.send("로그인하시오");
    } else {
      const params: any[] = [
        req.session.user_info.user_name,
        body.helper_board_title,
        body.helper_board_content,
        body.helper_board_place,
        false,
      ];
      const createBoardSql: string =
        "INSERT INTO helper_board (helper_board_writer, helper_board_title, helper_board_content, helper_board_place, helper_board_done) VALUES(?, ?, ?, ?, ?);";

      const [rows] = await conn.query(createBoardSql, params);
      if (!rows[0]) {
        await conn.query(createBoardSql, params);
        res.send(rows);
      }
    }
  } catch (err) {
    res.send(err);
  }
};

// 게시물 수정
export const update_helper_board: RequestHandler = async (req, res) => {
  // #swagger.tags = ['Helper_boards']
  try {
    const header = req.params;
    const params: any[] = [header.boardId];
    const authSql =
      "SELECT * FROM helper_board WHERE helper_board_id = ? LIMIT 1";
    const body = req.body;
    const updateParams: any[] = [
      body.helper_board_title,
      body.helper_board_content,
      body.helper_board_place,
      body.helper_board_done,
    ];
    const updateSql =
      "UPDATE helper_board SET helper_board_title = ?, helper_board_content = ?, helper_board_place = ?, helper_board_done = ? WHERE helper_board_id = ?";

    if (!req.session.user_info) {
      res.send("로그인하시오");
    } else {
      const [auth] = await conn.query(authSql, params);
      if (auth[0].helper_board_writer !== req.session.user_info.user_name) {
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
export const delete_helper_board: RequestHandler = async (req, res) => {
  // #swagger.tags = ['Helper_boards']
  try {
    const header = req.params;
    const params: any[] = [header.boardId];
    const sql =
      "SELECT helper_board_writer FROM helper_board WHERE helper_board_id = ? LIMIT 1";
    const deleteSql = "DELETE FROM helper_board WHERE helper_board_id = ?";
    if (!req.session.user_info) {
      res.send("로그인하세욤");
    } else {
      const [auth] = await conn.query(sql, params);
      if (auth[0].helper_board_writer !== req.session.user_info.user_name) {
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
export const hit_helper_board: RequestHandler = async (req, res) => {
  // #swagger.tags = ['Helper_boards']
  try {
    const header = req.params;
    const sql: string =
      "UPDATE helper_board SET helper_board_hit = helper_board_hit + 1 WHERE helper_board_id = ?";
    const params: any[] = [header.boardId];
    const [rows] = await conn.query(sql, params);
    res.send(rows);
  } catch (err) {
    res.send(err);
  }
};

export const helper_board_like: RequestHandler = async (req, res) => {
  // #swagger.tags = ['Helper_boards']
  try {
    const header = req.params;
    const params: any[] = [header.boardId, req.session.user_info.user_name];
    const sql =
      "SELECT * FROM who_helper_like WHERE where_helper_board_id = ?, who_user_name = ? LIMIT 1";
    const createSql =
      "INSERT INTO who_helper_like (where_helper_board_id, who_user_name) VALUES (?, ?)";
    const likeSql: string =
      "UPDATE helper_board SET helper_board_like = helper_board_like + 1 WHERE helper_board_id = ?";
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
