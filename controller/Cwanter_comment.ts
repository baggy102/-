const Errands = require("../models");
const { Op } = require("sequelize");

// ======= Wanter_comment =======
// 댓글 보여주기
exports.read_wanter_comment = async (req, res) => {
  try {
    const result = await Errands.Wanter_comment.findAll({
      where: { wanter_comment_board_id: { [Op.eq]: req.params.boardId } },
    });
    res.send(result);
  } catch (err) {
    res.send(err);
  }
};

// 댓글 생성
exports.create_wanter_comment = async (req, res) => {
  try {
    if (!req.session.user_info) {
      res.send(false);
    } else {
      const result = await Errands.Wanter_comment.create({
        wanter_comment_board_id: req.params.boardId,
        wanter_comment_writer: req.session.user_info.user_name,
        wanter_comment_content: req.body.wanter_comment_content,
      });
      res.send(result);
    }
  } catch (err) {
    res.send(err);
  }
};

// 댓글 수정
exports.update_wanter_comment = async (req, res) => {
  try {
    if (!req.session.user_info) {
      res.send("로그인 하세요");
    } else {
      const auth = await Errands.Wanter_comment.findOne({
        attributes: ["wanter_comment_writer"],
        where: { wanter_comment_id: { [Op.eq]: req.params.commentId } },
      });
      if (
        auth.dataValues.wanter_comment_writer !==
        req.session.user_info.user_name
      ) {
        res.send("작성자만 수정가능");
      } else {
        const [result] = await Errands.Wanter_comment.update(
          {
            wanter_comment_content: req.body.wanter_comment_content,
          },
          {
            where: {
              wanter_comment_id: { [Op.eq]: req.params.commentId },
              wanter_comment_board_id: { [Op.eq]: req.params.boardId },
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
exports.delete_wanter_comment = async (req, res) => {
  try {
    if (!req.session.user_info) {
      res.send("로그인 하세염");
    } else {
      const auth = await Errands.Wanter_comment.findOne({
        attributes: ["wanter_comment_writer"],
        where: { wanter_comment_id: { [Op.eq]: req.params.commentId } },
      });
      if (
        auth.dataValues.wanter_comment_writer !==
        req.session.user_info.user_name
      ) {
        res.send("작성자만 댓글 삭제할 수 있습니다");
      } else {
        const result = await Errands.Wanter_comment.destroy({
          where: {
            wanter_comment_id: { [Op.eq]: req.params.commentId },
            wanter_comment_board_id: { [Op.eq]: req.params.boardId },
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
