import express, { RequestHandler } from "express";
import session from "express-session";
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
// ======= Helper_comment =======
// 댓글 보여주기
export const read_helper_comment: RequestHandler = async (req, res) => {
  try {
    const header = req.params;
    const params: any[] = [header.boardId];
    const sql: string =
      "SELECT * FROM helper_comment WHERE helper_comment_board_id = ?";
    const [rows] = await conn.query(sql, params);
    res.send(rows);
  } catch (err) {
    res.send(err);
  }
};

// 댓글 생성
export const create_helper_comment: RequestHandler = async (req, res) => {
  try {
    if (!req.session.user_info) {
      res.send(false);
    } else {
      const params: any[] = [
        req.params.boardId,
        req.session.user_info.user_name,
        req.body.helper_comment_content,
      ];
      const sql: string =
        "INSERT INTO helper_comment (helper_comment_board_id, helper_comment_writer, helper_comment_content) VALUES (?, ?, ?)";
      const [rows] = await conn.query(sql, params);
      res.send(rows);
    }
  } catch (err) {
    res.send(err);
  }
};

// 댓글 수정
export const update_helper_comment: RequestHandler = async (req, res) => {
  try {
    const header = req.params;
    const body = req.body;
    const sql: string =
      "SELECT helper_comment_writer FROM helper_comment WHERE helper_comment_id = ? LIMIT 1";
    const updateSql: string =
      "UPDATE helper_comment SET helper_comment_content = ? WHERE helper_comment_id = ?, helper_comment_board_id = ?";
    const params: any[] = [
      body.helper_comment_content,
      header.commentId,
      header.boardId,
    ];
    if (!req.session.user_info) {
      res.send("로그인 ㄱ");
    } else {
      const [auth] = await conn.query(sql, [header.commentId]);
      if (auth[0].helper_comment_writer !== req.session.user_info.user_name) {
        res.send("작성자만 댓글 수정 가능");
      } else {
        const [result] = await conn.query(updateSql, params);
        if (result[0] === 0) {
          return res.send(false);
        } else {
          res.send(true);
        }
      }
    }
  } catch (err) {
    res.send(err);
  }
};

// 댓글 삭제
export const delete_helper_comment: RequestHandler = async (req, res) => {
  try {
    const header = req.params;
    const body = req.body;
    const params: any[] = [header.commentId, header.boardId];
    const sql: string =
      "SELECT helper_comment_writer FROM helper_comment WHERE helper_comment_id = ? LIMIT 1";
    const deleteSql: string =
      "DELETE FROM helper_comment WHERE helper_comment_id = ?, helper_comment_board_id = ?";
    if (!req.session.user_info) {
      res.send("로그인 ㄱㄱ");
    } else {
      const [auth] = await conn.query(sql, params[0]);
      if (auth[0].helper_comment_writer !== req.session.user_info.user_name) {
        res.send("작성자만 ㄱㄴ");
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
