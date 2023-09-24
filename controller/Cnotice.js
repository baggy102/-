const Errands = require("../models");
const { Op } = require("sequelize");

// ======= Notice Board =======

// 메인페이지 몇 개만 불러오기 일단 만듬
exports.read_few_notice = async (req, res) => {
  try {
    const result = await Errands.Notice.findAll({
      order: [["notice_date", "desc"]],
      limit: 5,
    });
    res.send(result);
  } catch (err) {
    res.send(err);
  }
};

// 전체 불러오기
exports.read_notice = async (req, res) => {
  try {
    const result = await Errands.Notice.findAll({
      order: [["wanter_board_date", "asc"]],
    });
    res.send(result);
  } catch (err) {
    res.send(err);
  }
};

// 하나만 불러오기
exports.read_one_notice = async (req, res) => {
  try {
    const result = await Errands.Notice.findOne({
      where: { notice_id: { [Op.eq]: req.params.boardId } },
    });
    res.send(result);
  } catch (err) {
    res.send(err);
  }
};

// 공지 생성
exports.create_notice = async (req, res) => {
  try {
    if (!req.session.user_info) {
      res.send("로그인하시오");
    } else {
      const auth = await Errands.User_info.findOne({
        attributes: ["user_type"],
        where: { user_type: { [Op.eq]: req.session.user_info.user_type } },
      });
      if (auth.dataValues.user_type == "root") {
        const result = Errands.Notice.create({
          notice_writer: req.session.user_name,
          notice_title: req.body.notice_title,
          notice_content: req.body.notice_content,
        });

        res.send(result);
      } else {
        res.send("생성 권한이 없습니다");
      }
    }
  } catch (err) {
    res.send(err);
  }
};

// 공지 수정
exports.update_notice = async (req, res) => {
  try {
    if (!req.session.user_info) {
      res.send("로그인하시오");
    } else {
      const auth = await Errands.User_info.findOne({
        attributes: ["user_type"],
        where: { user_type: { [Op.eq]: req.session.user_info.user_type } },
      });
      if (auth.dataValues.user_type == "root") {
        const [result] = Errands.Notice.update(
          {
            notice_title: req.body.notice_title,
            notice_content: req.body.notice_content,
          },
          { where: { notice_id: { [Op.eq]: req.params.boardId } } }
        );
        if (result === 0) {
          return res.send(false);
        }
        res.send(true);
      } else {
        res.send("수정 권한이 없습니다");
      }
    }
  } catch (err) {
    res.send(err);
  }
};

// 공지 삭제
exports.delete_notice = async (req, res) => {
  try {
    if (!req.session.user_info) {
      res.send("로그인하시요");
    } else {
      const auth = await Errands.User_info.findOne({
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
      } else {
        res.send("삭제 권한이 없습니다");
      }
    }
  } catch (err) {
    res.send(err);
  }
};
