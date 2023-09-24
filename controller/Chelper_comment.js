const Errands = require("../models");
const { Op } = require("sequelize");

// ======= Helper_comment =======
// 댓글 보여주기
exports.read_helper_comment = async (req, res) => {
  try {
    const result = await Errands.Helper_comment.findAll({
      where: { helper_comment_board_id: { [Op.eq]: req.params.boardId } },
    });
    res.send(result);
  } catch (err) {
    res.send(err);
  }
};

// 댓글 생성
exports.create_helper_comment = async (req, res) => {
  try {
    if (!req.session.user_info) {
      res.send(false);
    } else {
      const result = await Errands.Helper_comment.create({
        helper_comment_board_id: req.params.boardId,
        helper_comment_writer: req.session.user_info.user_name,
        helper_comment_content: req.body.helper_comment_content,
      });
      res.send(result);
    }
  } catch (err) {
    res.send(err);
  }
};

// 댓글 수정
exports.update_helper_comment = async (req, res) => {
  try {
    if (!req.session.user_info) {
      res.send("로그인 ㄱ");
    } else {
      const auth = await Errands.Helper_comment.findOne({
        attributes: ["helper_comment_writer"],
        where: { helper_comment_id: { [Op.eq]: req.params.commentId } },
      });
      if (
        auth.dataValues.wanter_comment_writer !==
        req.session.user_info.user_name
      ) {
        res.send("작성자만 댓글 수정 가능");
      } else {
        const [result] = await Errands.Helper_comment.update(
          {
            helper_comment_content: req.body.helper_comment_content,
          },
          {
            where: {
              helper_comment_id: { [Op.eq]: req.params.commentId },
              helper_comment_board_id: { [Op.eq]: req.params.boardId },
            },
          }
        );
        if (result === 0) {
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
exports.delete_helper_comment = async (req, res) => {
  try {
    if (!req.session.user_info) {
      res.send("로그인 ㄱㄱ");
    } else {
      const auth = await Errands.Helper_comment.findOne({
        attributes: ["helper_comment_writer"],
        where: { wanter_comment_id: { [Op.eq]: req.params.commentId } },
      });
      if (
        auth.dataValues.helper_comment_writer !==
        req.session.user_info.user_name
      ) {
        res.send("작성자만 ㄱㄴ");
      } else {
        const result = await Errands.Helper_comment.destroy({
          where: {
            helper_comment_id: { [Op.eq]: req.params.commentId },
            helper_comment_board_id: { [Op.eq]: req.params.boardId },
          },
        });
        if (!result) {
          return res.send(false);
        }
        res.send(true);
      }
    }
  } catch (err) {
    res.send(err);
  }
};
