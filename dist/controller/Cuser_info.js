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
exports.user_like = exports.set_user_img = exports.user_helper_board = exports.user_wanter_board = exports.userUpdate = exports.userWithdrawal = exports.userLike = exports.read_detail_user = exports.read_user = exports.read_few_user = exports.userLogout = exports.userRegister = exports.checkUserName = exports.checkUserId = exports.userLogin = void 0;
const config_json_1 = __importDefault(require("../config/config.json"));
const mysql = require("mysql2");
const conn = mysql
    .createPool({
    host: config_json_1.default.development.host,
    user: config_json_1.default.development.username,
    password: config_json_1.default.development.password,
    database: config_json_1.default.development.database,
})
    .promise();
const userLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Users']
    try {
        const body = req.body;
        const sql = "SELECT * FROM user_info WHERE user_id = ? && user_pw = ?";
        const params = [body.user_id, body.user_pw];
        const [rows] = yield conn.query(sql, params);
        if (rows[0] != null) {
            req.session.user_info = rows[0];
            res.send({ user_info: rows[0], msg: true });
        }
        else {
            res.send(false);
        }
    }
    catch (err) {
        res.send(err);
    }
});
exports.userLogin = userLogin;
const checkUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Users']
    try {
        const body = req.body;
        const sql = "SELECT user_id FROM user_info WHERE user_id = ? LIMIT 1";
        const params = [body.user_id];
        const [rows] = yield conn.query(sql, params);
        if (!rows[0]) {
            return res.send(true);
        }
        else {
            return res.send(false);
        }
    }
    catch (err) {
        res.send(err);
    }
});
exports.checkUserId = checkUserId;
// 닉네임 중복검사
const checkUserName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Users']
    try {
        const body = req.body;
        const sql = "SELECT user_name FROM user_info WHERE user_name = ? LIMIT 1";
        const params = [body.user_name];
        const [rows] = yield conn.query(sql, params);
        if (!rows[0]) {
            return res.send(false);
        }
        else {
            return res.send(true);
        }
    }
    catch (err) {
        res.send(err);
    }
});
exports.checkUserName = checkUserName;
// 회원가입
const userRegister = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Users']
    try {
        const body = req.body;
        const sql = "SELECT user_id FROM user_info WHERE user_id = ? LIMIT 1";
        const params = [
            body.user_id,
            body.user_pw,
            body.user_name,
            body.user_type,
        ];
        const createUserSql = "INSERT INTO user_info (user_id, user_pw, user_name, user_type) VALUES(?, ?, ?, ?);";
        const [rows] = yield conn.query(sql, params[0]);
        if (!rows[0]) {
            yield conn.query(createUserSql, params);
            res.send(true);
        }
        else {
            res.send(false);
        }
    }
    catch (err) {
        res.send(err);
    }
});
exports.userRegister = userRegister;
// 로그아웃
const userLogout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Users']
    try {
        console.log(req.session);
        req.session.destroy((err) => {
            if (err) {
                throw err;
            }
            console.log("로그아웃 여부");
            console.log(req.session);
            res.send(true);
        });
    }
    catch (err) {
        res.send(err);
    }
});
exports.userLogout = userLogout;
// 메인페이지 상위 5명 보여주기
const read_few_user = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Users']
    try {
        const [rows] = yield conn.query("SELECT * FROM user_info ORDER BY user_like DESC LIMIT 5");
        res.send(rows[0]);
    }
    catch (err) {
        res.send(err);
    }
});
exports.read_few_user = read_few_user;
// 전체 다 보여주기
const read_user = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Users']
    try {
        const [rows] = yield conn.query("SELECT * FROM user_info ORDER BY user_like DESC LIMIT 5");
        res.send(rows);
    }
    catch (err) {
        res.send(err);
    }
});
exports.read_user = read_user;
// detail
const read_detail_user = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Users']
    try {
        const header = req.params;
        const sql = "SELECT * FROM user_info WHERE id = ? LIMIT 1";
        const params = [header.user];
        const [rows] = yield conn.query(sql, params);
        res.send(rows[0]);
    }
    catch (err) {
        res.send(err);
    }
});
exports.read_detail_user = read_detail_user;
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
const userLike = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Users']
    try {
        if (!req.session.checkLiked) {
            req.session.checkLiked = true;
            req.session.checkLikedExpires = Date.now() + 60 * 60 * 24 * 1000;
            const header = req.params;
            const sql = `UPDATE User_info SET user_like = user_like + 1 WHERE id = ?`;
            const params = [header.user];
            const [rows] = yield conn.query(sql, params);
            res.send(rows);
        }
        else {
            res.send("오늘 이미 추천하셨습니다.");
        }
    }
    catch (err) {
        res.send(err);
    }
});
exports.userLike = userLike;
// 회원탈퇴
const userWithdrawal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Users']
    try {
        const header = req.params;
        const sql = "SELECT user_name FROM user_info WHERE id = ? LIMIT 1";
        const params = [header.userId];
        const [rows] = yield conn.query(sql, params);
        if (rows[0].user_name == req.session.user_info.user_name) {
            const deleteUserParams = "DELETE FROM user_info WHERE id = ?";
            const [delRows] = yield conn.query(deleteUserParams, params);
            if (!delRows) {
                res.send(false);
            }
            else {
                req.session.destroy((err) => {
                    if (err) {
                        throw err;
                    }
                    res.send(true);
                });
            }
        }
    }
    catch (err) {
        res.send(err);
    }
});
exports.userWithdrawal = userWithdrawal;
// 회원정보 수정
const userUpdate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Users']
    try {
        const userConfig = req.session.user_info;
        const params = [userConfig.user_name];
        const sql = "SELECT user_name FROM user_info WHERE user_name = ? LIMIT 1";
        const [auth] = yield conn.query(sql, params);
        console.log(auth[0]);
        if (auth[0].user_name == userConfig.user_name) {
            const body = req.body;
            const header = req.params;
            const headParams = [header.userId];
            const updateParams = [
                body.user_id,
                body.user_pw,
                body.user_name,
                body.user_type,
            ];
            const updateSql = "UPDATE user_info SET user_id = ?, user_pw = ?, user_name = ?, user_type = ? WHERE id = ?";
            const [rows] = yield conn.query(updateSql, updateParams, headParams);
            console.log(rows);
            if (rows === 0) {
                console.log(rows);
                return res.send(false);
            }
            else {
                res.send(true);
            }
        }
    }
    catch (err) {
        res.send(err);
    }
});
exports.userUpdate = userUpdate;
const user_wanter_board = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Users']
    try {
        const body = req.body;
        const params = [body.user_name];
        const sql = "SELECT * FROM wanter_board WHERE wanter_board_writer = ?";
        const [rows] = yield conn.query(sql, params);
        res.send(rows);
    }
    catch (err) {
        res.send(err);
    }
});
exports.user_wanter_board = user_wanter_board;
const user_helper_board = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Users']
    try {
        const body = req.body;
        const params = [body.user_name];
        const sql = "SELECT * FROM helper_board WHERE helper_board_writer = ?";
        const [rows] = yield conn.query(sql, params);
        res.send(rows);
    }
    catch (err) {
        res.send(err);
    }
});
exports.user_helper_board = user_helper_board;
const set_user_img = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Users']
    try {
        const updateFile = req.file;
        const header = req.params;
        const params = [updateFile.filename, header.user];
        const sql = "UPDATE user_info SET user_img = ? WHERE id = ?";
        const [rows] = yield conn.query(sql, params);
        console.log(rows[0]);
        if (rows[0] === 0) {
            return res.send(false);
        }
        else {
            res.send(true);
        }
    }
    catch (err) {
        res.send(err);
    }
});
exports.set_user_img = set_user_img;
const user_like = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Users']
    try {
        if (!req.session.user_info) {
            const header = req.params;
            const params = header.user;
            const sql = "SELECT * FROM user_info WHERE id = ? LIMIT 1";
            const [search] = yield conn.query(sql, params);
            if (!search) {
                res.send("오류임 모름이건");
            }
            else {
                search.addFollowing(parseInt(req.params.user, 10));
                res.send(true);
            }
        }
        else {
            res.send("로그인하시오");
        }
    }
    catch (err) {
        res.send(err);
    }
});
exports.user_like = user_like;
//# sourceMappingURL=Cuser_info.js.map