"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.delete_helper_comment = exports.update_helper_comment = exports.create_helper_comment = exports.read_helper_comment = void 0;
const config_json_1 = __importDefault(require("../config/config.json"));
const Errands = require("../models");
const { Op } = require("sequelize");
const mysql = require("mysql2");
const conn = mysql
    .createPool({
    host: config_json_1.default.development.host,
    user: config_json_1.default.development.username,
    password: config_json_1.default.development.password,
    database: config_json_1.default.development.database,
})
    .promise();
// ======= Helper_comment =======
// 댓글 보여주기
const read_helper_comment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Helper_comments']
    try {
        const header = req.params;
        const params = [header.boardId];
        const sql = "SELECT * FROM helper_comment WHERE helper_comment_board_id = ?";
        const [rows] = yield conn.query(sql, params);
        res.send(rows);
    }
    catch (err) {
        res.send(err);
    }
});
exports.read_helper_comment = read_helper_comment;
// 댓글 생성
const create_helper_comment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Helper_comments']
    try {
        if (!req.session.user_info) {
            res.send(false);
        }
        else {
            const params = [
                req.params.boardId,
                req.session.user_info.user_name,
                req.body.helper_comment_content,
            ];
            const sql = "INSERT INTO helper_comment (helper_comment_board_id, helper_comment_writer, helper_comment_content) VALUES (?, ?, ?)";
            const [rows] = yield conn.query(sql, params);
            res.send(rows);
        }
    }
    catch (err) {
        res.send(err);
    }
});
exports.create_helper_comment = create_helper_comment;
// 댓글 수정
const update_helper_comment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Helper_comments']
    try {
        const header = req.params;
        const body = req.body;
        const sql = "SELECT helper_comment_writer FROM helper_comment WHERE helper_comment_id = ? LIMIT 1";
        const updateSql = "UPDATE helper_comment SET helper_comment_content = ? WHERE helper_comment_id = ?, helper_comment_board_id = ?";
        const params = [
            body.helper_comment_content,
            header.commentId,
            header.boardId,
        ];
        if (!req.session.user_info) {
            res.send("로그인 ㄱ");
        }
        else {
            const [auth] = yield conn.query(sql, [header.commentId]);
            if (auth[0].helper_comment_writer !== req.session.user_info.user_name) {
                res.send("작성자만 댓글 수정 가능");
            }
            else {
                const [result] = yield conn.query(updateSql, params);
                if (result[0] === 0) {
                    return res.send(false);
                }
                else {
                    res.send(true);
                }
            }
        }
    }
    catch (err) {
        res.send(err);
    }
});
exports.update_helper_comment = update_helper_comment;
// 댓글 삭제
const delete_helper_comment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Helper_comments']
    try {
        const header = req.params;
        const body = req.body;
        const params = [header.commentId, header.boardId];
        const sql = "SELECT helper_comment_writer FROM helper_comment WHERE helper_comment_id = ? LIMIT 1";
        const deleteSql = "DELETE FROM helper_comment WHERE helper_comment_id = ?, helper_comment_board_id = ?";
        if (!req.session.user_info) {
            res.send("로그인 ㄱㄱ");
        }
        else {
            const [auth] = yield conn.query(sql, params[0]);
            if (auth[0].helper_comment_writer !== req.session.user_info.user_name) {
                res.send("작성자만 ㄱㄴ");
            }
            else {
                const [result] = yield conn.query(deleteSql, params);
                if (!result[0]) {
                    return res.send(false);
                }
                res.send(true);
            }
        }
    }
    catch (err) {
        res.send(err);
    }
});
exports.delete_helper_comment = delete_helper_comment;
//# sourceMappingURL=Chelper_comment.js.map