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
exports.helper_board_like = exports.hit_helper_board = exports.delete_helper_board = exports.update_helper_board = exports.create_helper_board = exports.read_one_helper_board = exports.read_helper_board = exports.read_few_helper_board = void 0;
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
// ======= Helper_board =======
// 최신5개만 가져오기
const read_few_helper_board = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Helper_boards']
    try {
        const sql = "SELECT * FROM helper_board order by helper_board_date ASC LIMIT 3";
        const [rows] = yield conn.query(sql);
        res.send(rows);
    }
    catch (err) {
        res.send(err);
    }
});
exports.read_few_helper_board = read_few_helper_board;
// 전체 다 가져오기
const read_helper_board = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Helper_boards']
    try {
        const sql = "SELECT * FROM helper_board order by helper_board_date ASC";
        const [rows] = yield conn.query(sql);
        res.send(rows);
    }
    catch (err) {
        res.send(err);
    }
});
exports.read_helper_board = read_helper_board;
// 게시물 하나만 가져오기
const read_one_helper_board = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Helper_boards']
    try {
        const header = req.params;
        const params = [header.boardId];
        const sql = "SELECT * FROM helper_board WHERE helper_board_id = ?";
        const [rows] = yield conn.query(sql, params);
        res.send(rows);
    }
    catch (err) {
        res.send(err);
    }
});
exports.read_one_helper_board = read_one_helper_board;
// 게시물 생성
const create_helper_board = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Helper_boards']
    try {
        const body = req.body;
        if (!req.session.user_info) {
            res.send("로그인하시오");
        }
        else {
            const params = [
                req.session.user_info.user_name,
                body.helper_board_title,
                body.helper_board_content,
                body.helper_board_place,
                false,
            ];
            const createBoardSql = "INSERT INTO helper_board (helper_board_writer, helper_board_title, helper_board_content, helper_board_place, helper_board_done) VALUES(?, ?, ?, ?, ?);";
            const [rows] = yield conn.query(createBoardSql, params);
            if (!rows[0]) {
                yield conn.query(createBoardSql, params);
                res.send(rows);
            }
        }
    }
    catch (err) {
        res.send(err);
    }
});
exports.create_helper_board = create_helper_board;
// 게시물 수정
const update_helper_board = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Helper_boards']
    try {
        const header = req.params;
        const params = [header.boardId];
        const authSql = "SELECT * FROM helper_board WHERE helper_board_id = ? LIMIT 1";
        const body = req.body;
        const updateParams = [
            body.helper_board_title,
            body.helper_board_content,
            body.helper_board_place,
            body.helper_board_done,
        ];
        const updateSql = "UPDATE helper_board SET helper_board_title = ?, helper_board_content = ?, helper_board_place = ?, helper_board_done = ? WHERE helper_board_id = ?";
        if (!req.session.user_info) {
            res.send("로그인하시오");
        }
        else {
            const [auth] = yield conn.query(authSql, params);
            if (auth[0].helper_board_writer !== req.session.user_info.user_name) {
                res.send("작성자만 수정 가능");
            }
            else {
                const [result] = yield conn.query(updateSql, updateParams, params);
                if (result[0] === 0) {
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
exports.update_helper_board = update_helper_board;
// 게시물 삭제
const delete_helper_board = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Helper_boards']
    try {
        const header = req.params;
        const params = [header.boardId];
        const sql = "SELECT helper_board_writer FROM helper_board WHERE helper_board_id = ? LIMIT 1";
        const deleteSql = "DELETE FROM helper_board WHERE helper_board_id = ?";
        if (!req.session.user_info) {
            res.send("로그인하세욤");
        }
        else {
            const [auth] = yield conn.query(sql, params);
            if (auth[0].helper_board_writer !== req.session.user_info.user_name) {
                res.send("작성자만 삭제 가능");
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
exports.delete_helper_board = delete_helper_board;
// 조회수 up
const hit_helper_board = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Helper_boards']
    try {
        const header = req.params;
        const sql = "UPDATE helper_board SET helper_board_hit = helper_board_hit + 1 WHERE helper_board_id = ?";
        const params = [header.boardId];
        const [rows] = yield conn.query(sql, params);
        res.send(rows);
    }
    catch (err) {
        res.send(err);
    }
});
exports.hit_helper_board = hit_helper_board;
const helper_board_like = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Helper_boards']
    try {
        const header = req.params;
        const params = [header.boardId, req.session.user_info.user_name];
        const sql = "SELECT * FROM who_helper_like WHERE where_helper_board_id = ?, who_user_name = ? LIMIT 1";
        const createSql = "INSERT INTO who_helper_like (where_helper_board_id, who_user_name) VALUES (?, ?)";
        const likeSql = "UPDATE helper_board SET helper_board_like = helper_board_like + 1 WHERE helper_board_id = ?";
        const [auth] = yield conn.query(sql, params);
        if (!auth[0]) {
            yield conn.query(createSql, params);
            yield conn.query(likeSql, params[0]);
            res.send(true);
        }
        else {
            res.send(false); // 이미 좋아요 누른 게시글입니다
        }
    }
    catch (err) {
        res.send(err);
    }
});
exports.helper_board_like = helper_board_like;
//# sourceMappingURL=Chelper_board.js.map