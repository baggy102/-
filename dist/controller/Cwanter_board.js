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
exports.wanter_board_like = exports.done_wanter_board = exports.search_wanter_board = exports.hit_wanter_board = exports.delete_wanter_board = exports.update_wanter_board = exports.create_wanter_board = exports.read_one_wanter_board = exports.read_wanter_board = exports.read_few_wanter_board = void 0;
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
// ======= Wanter_board =======
// 매인페이지에 5개 보여주기 deadline순 5개
const read_few_wanter_board = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Wanter_boards']
    try {
        const sql = "SELECT * FROM wanter_board order by wanter_board_dead_line DESC LIMIT 5";
        const [rows] = yield conn.query(sql);
        res.send(rows);
    }
    catch (err) {
        res.send(err);
    }
});
exports.read_few_wanter_board = read_few_wanter_board;
// 전체 다 보여주기
const read_wanter_board = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Wanter_boards']
    try {
        const sql = "SELECT * FROM wanter_board order by wanter_board_date ASC";
        const [rows] = yield conn.query(sql);
        res.send(rows);
    }
    catch (err) {
        res.send(err);
    }
});
exports.read_wanter_board = read_wanter_board;
// 게시물 하나만 보여주기
const read_one_wanter_board = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Wanter_boards']
    try {
        const header = req.params;
        const params = [header.boardId];
        const sql = "SELECT * FROM wanter_board WHERE wanter_board_id = ?";
        const [rows] = yield conn.query(sql, params);
        res.send(rows);
    }
    catch (err) {
        res.send(err);
    }
});
exports.read_one_wanter_board = read_one_wanter_board;
// 게시물 생성
const create_wanter_board = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Wanter_boards']
    try {
        const body = req.body;
        if (!req.session.user_info) {
            res.send("로그인하시오");
        }
        else {
            const params = [
                req.session.user_info.user_name,
                body.wanter_board_title,
                body.wanter_board_content,
                body.wanter_board_place,
                body.wanter_board_dead_line,
                body.wanter_board_place_detail,
                false,
            ];
            const createBoardSql = "INSERT INTO wanter_board (wanter_board_writer, wanter_board_title, wanter_board_content, wanter_board_place, wanter_board_dead_line, wanter_board_place_detail,wanter_board_done) VALUES(?, ?, ?, ?, ?);";
            const [rows] = yield conn.query(createBoardSql, params);
            res.send(rows);
        }
    }
    catch (err) {
        res.send(err);
    }
});
exports.create_wanter_board = create_wanter_board;
// 게시물 수정
const update_wanter_board = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Wanter_boards']
    try {
        const header = req.params;
        const params = [header.boardId];
        const authSql = "SELECT * FROM wanter_board WHERE wanter_board_id = ? LIMIT 1";
        const body = req.body;
        const updateParams = [
            body.wanter_board_title,
            body.wanter_board_content,
            body.wanter_board_place,
            body.wanter_board_done,
        ];
        const updateSql = "UPDATE wanter_board SET wanter_board_title = ?, wanter_board_content = ?, wanter_board_place = ?, wanter_board_done = ? WHERE wanter_board_id = ?";
        if (!req.session.user_info) {
            res.send("로그인하시오");
        }
        else {
            const [auth] = yield conn.query(authSql, params);
            if (auth[0].wanter_board_writer !== req.session.user_info.user_name) {
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
exports.update_wanter_board = update_wanter_board;
// 게시물 삭제
const delete_wanter_board = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Wanter_boards']
    try {
        const header = req.params;
        const params = [header.boardId];
        const sql = "SELECT wanter_board_writer FROM wanter_board WHERE wanter_board_id = ? LIMIT 1";
        const deleteSql = "DELETE FROM wanter_board WHERE wanter_board_id = ?";
        if (!req.session.user_info) {
            res.send("로그인하세욤");
        }
        else {
            const [auth] = yield conn.query(sql, params);
            if (auth[0].wanter_board_writer !== req.session.user_info.user_name) {
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
exports.delete_wanter_board = delete_wanter_board;
// 조회수 up
const hit_wanter_board = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Wanter_boards']
    try {
        const header = req.params;
        const sql = "UPDATE wanter_board SET wanter_board_hit = wanter_board_hit + 1 WHERE wanter_board_id = ?";
        const params = [header.boardId];
        const [rows] = yield conn.query(sql, params);
        res.send(rows);
    }
    catch (err) {
        res.send(err);
    }
});
exports.hit_wanter_board = hit_wanter_board;
// 검색
const search_wanter_board = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Wanter_boards']
    try {
        const { boardType, optionValue } = req.params;
        const search = req.query.search;
        if (boardType == "wanter") {
            if (optionValue == "wanter_board_writer") {
                const result = yield Errands.Wanter_board.findAll({
                    where: {
                        wanter_board_writer: { [Op.like]: `%${search}%` },
                    },
                });
                res.send(result);
            }
            else if (optionValue === "wanter_board_title") {
                const result = yield Errands.Wanter_board.findAll({
                    where: {
                        wanter_board_title: { [Op.like]: `%${search}%` },
                    },
                });
                res.send(result);
            }
            else if (optionValue === "wanter_board_place") {
                const result = yield Errands.Wanter_board.findAll({
                    where: {
                        wanter_board_place: { [Op.like]: `%${search}%` },
                    },
                });
                res.send(result);
            }
        }
        else if (boardType == "helper") {
            if (optionValue == "helper_board_writer") {
                const result = yield Errands.Helper_board.findAll({
                    where: {
                        helper_board_writer: { [Op.like]: `%${search}%` },
                    },
                });
                res.send(result);
            }
            else if (optionValue === "helper_board_title") {
                const result = yield Errands.Helper_board.findAll({
                    where: {
                        helper_board_title: { [Op.like]: `%${search}%` },
                    },
                });
                res.send(result);
            }
            else if (optionValue === "wanter_board_place") {
                const result = yield Errands.Helper_board.findAll({
                    where: {
                        helper_board_place: { [Op.like]: `%${search}%` },
                    },
                });
                res.send(result);
            }
        }
        else {
            res.send("알 수 없는 오류");
        }
    }
    catch (err) {
        res.send(err);
    }
});
exports.search_wanter_board = search_wanter_board;
// 게시물 done, proceeding params -> session 변경
// 게시물 done 처리
const done_wanter_board = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Wanter_boards']
    try {
        const header = req.params;
        const params = [header.boardId];
        const sql = "SELECT wanter_board_writer FROM wanter_board WHERE wanter_board_id = ? LIMIT 1";
        const updateDoneSql = "UPDATE wanter_board SET wanter_board_done = true WHERE wanter_board_id = ?";
        if (!req.session.user_info) {
            res.send("로그인하시오");
        }
        else {
            const [auth] = yield conn.query(sql, params);
            if (auth[0].wanter_board_writer !== req.session.user_info.user_name) {
                res.send("작성자만 완료가능");
            }
            else {
                const [result] = yield conn.qeury(updateDoneSql, params);
                if (result[0] === 0) {
                    res.send(false);
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
exports.done_wanter_board = done_wanter_board;
const wanter_board_like = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Wanter_boards']
    try {
        const header = req.params;
        const params = [header.boardId, req.session.user_info.user_name];
        const sql = "SELECT * FROM who_wanter_like WHERE where_wanter_board_id = ?, who_user_name = ? LIMIT 1";
        const createSql = "INSERT INTO who_wanter_like (where_wnater_board_id, who_user_name) VALUES (?, ?)";
        const likeSql = "UPDATE wanter_board SET wanter_board_like = wanter_board_like + 1 WHERE wanter_board_id = ?";
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
exports.wanter_board_like = wanter_board_like;
//# sourceMappingURL=Cwanter_board.js.map