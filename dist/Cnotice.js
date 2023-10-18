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
exports.delete_notice = exports.update_notice = exports.create_notice = exports.read_one_notice = exports.read_notice = exports.read_few_notice = void 0;
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
// ======= Notice Board =======
// 메인페이지 몇 개만 불러오기 일단 만듬
const read_few_notice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield Errands.Notice.findAll({
            order: [["notice_date", "desc"]],
            limit: 5,
        });
        res.send(result);
    }
    catch (err) {
        res.send(err);
    }
});
exports.read_few_notice = read_few_notice;
// 전체 불러오기
const read_notice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield Errands.Notice.findAll({
            order: [["wanter_board_date", "asc"]],
        });
        res.send(result);
    }
    catch (err) {
        res.send(err);
    }
});
exports.read_notice = read_notice;
// 하나만 불러오기
const read_one_notice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield Errands.Notice.findOne({
            where: { notice_id: { [Op.eq]: req.params.boardId } },
        });
        res.send(result);
    }
    catch (err) {
        res.send(err);
    }
});
exports.read_one_notice = read_one_notice;
// 공지 생성
const create_notice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.session.user_info) {
            res.send("로그인하시오");
        }
        else {
            const auth = yield Errands.User_info.findOne({
                attributes: ["user_type"],
                where: { user_type: { [Op.eq]: req.session.user_info.user_type } },
            });
            if (auth.dataValues.user_type == "root") {
                const result = Errands.Notice.create({
                    notice_writer: req.session.user_info.user_name,
                    notice_title: req.body.notice_title,
                    notice_content: req.body.notice_content,
                });
                res.send(result);
            }
            else {
                res.send("생성 권한이 없습니다");
            }
        }
    }
    catch (err) {
        res.send(err);
    }
});
exports.create_notice = create_notice;
// 공지 수정
const update_notice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.session.user_info) {
            res.send("로그인하시오");
        }
        else {
            const auth = yield Errands.User_info.findOne({
                attributes: ["user_type"],
                where: { user_type: { [Op.eq]: req.session.user_info.user_type } },
            });
            if (auth.dataValues.user_type == "root") {
                const [result] = Errands.Notice.update({
                    notice_title: req.body.notice_title,
                    notice_content: req.body.notice_content,
                }, { where: { notice_id: { [Op.eq]: req.params.boardId } } });
                if (result === 0) {
                    return res.send(false);
                }
                res.send(true);
            }
            else {
                res.send("수정 권한이 없습니다");
            }
        }
    }
    catch (err) {
        res.send(err);
    }
});
exports.update_notice = update_notice;
// 공지 삭제
const delete_notice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.session.user_info) {
            res.send("로그인하시요");
        }
        else {
            const auth = yield Errands.User_info.findOne({
                attributes: ["user_type"],
                where: { user_type: { [Op.eq]: req.session.user_info.user_type } },
            });
            console.log(auth);
            if (auth) {
                if (auth.dataValues.user_type == "root") {
                    const result = Errands.Notice.destroy({
                        where: { notice_id: { [Op.eq]: req.params.boardId } },
                    });
                    if (!result) {
                        return res.send(false);
                    }
                    return res.send(true);
                }
            }
            else {
                res.send("삭제 권한이 없습니다");
            }
        }
    }
    catch (err) {
        res.send(err);
    }
});
exports.delete_notice = delete_notice;
//# sourceMappingURL=Cnotice.js.map