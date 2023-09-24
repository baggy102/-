const Errands = require("../models");
const { Op } = require("sequelize");

// ======= Helper_board =======
// 최신5개만 가져오기
exports.read_few_helper_board = async (req, res) => {
  try {
    const result = await Errands.Helper_board.findAll({
      order: [["helper_board_date", "asc"]],
      limit: 3,
    });
    res.send(result);
  } catch (err) {
    res.send(err);
  }
};

// 전체 다 가져오기
exports.read_helper_board = async (req, res) => {
  try {
    const result = await Errands.Helper_board.findAll({
      helper_board_writer: req.session.user_name,
      helper_board_title: req.body.helper_board_title,
      helper_board_content: req.body.helper_board_content,
      helper_board_place: req.body.helper_board_place,
      helper_board_done: false,
    });
    res.send(result);
  } catch (err) {
    res.send(err);
  }
};

// 게시물 하나만 가져오기
exports.read_one_helper_board = async (req, res) => {
  try {
    const result = await Errands.Helper_board.findOne({
      where: { helper_board_id: { [Op.eq]: req.params.boardId } },
    });
    res.send(result);
  } catch (err) {
    res.send(err);
  }
};

// 게시물 생성
exports.create_helper_board = async (req, res) => {
  try {
    if (!req.session.user_info) {
      res.send("로그인하시오");
    } else {
      const result = await Errands.Helper_board.create({
        helper_board_writer: req.session.user_info.user_name,
        helper_board_title: req.body.helper_board_title,
        helper_board_content: req.body.helper_board_content,
        helper_board_place: req.body.helper_board_place,
        helper_board_done: false,
      });
      res.send(result);
    }
  } catch (err) {
    res.send(err);
  }
};

// 게시물 수정
exports.update_helper_board = async (req, res) => {
  try {
    if (!req.session.user_info) {
      res.send("로그인하시오");
    } else {
      const auth = await Errands.Helper_board.findOne({
        attributes: ["helper_board_writer"],
        where: { helper_board_id: { [Op.eq]: req.params.boardId } },
      });
      if (
        auth.dataValues.helper_board_writer !== req.session.user_info.user_name
      ) {
        req.send("작성자만 수정 가능");
      } else {
        const [result] = await Errands.Helper_board.update(
          {
            helper_board_title: req.body.helper_board_title,
            helper_board_content: req.body.helper_board_content,
            helper_board_place: req.body.helper_board_place,
            helper_board_done: req.body.done,
          },
          {
            where: { helper_board_id: { [Op.eq]: req.params.boardId } },
          }
        );
        if (result === 0) {
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
exports.delete_helper_board = async (req, res) => {
  try {
    if (!req.session.user_info) {
      res.send("로그인하세욤");
    } else {
      const auth = await Errands.Helper_board.findOne({
        attributes: ["helper_board_writer"],
        where: { helper_board_id: { [Op.eq]: req.params.boardId } },
      });
      if (
        auth.dataValues.helper_board_writer !== req.session.user_info.user_name
      ) {
        res.send("작성자만 삭제 가능");
      } else {
        const result = await Errands.Helper_board.destroy({
          where: {
            helper_board_id: { [Op.eq]: req.params.boardId },
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

// 조회수 up
exports.hit_helper_board = async (req, res) => {
  try {
    const result = await Errands.Helper_board.increment(
      { helper_board_hit: 1 },
      { where: { helper_board_id: { [Op.eq]: req.params.boardId } } }
    );
    res.send(result);
  } catch (err) {
    res.send(err);
  }
};

exports.helper_board_like = async (req, res) => {
  try {
    const auth = await Errands.Who_helper_like.findOne({
      where: {
        where_helper_board_id: { [Op.eq]: req.params.boardId },
        who_user_name: { [Op.eq]: req.session.user_info.user_name },
      },
    });
    if (!auth) {
      await Errands.Who_helper_like.create({
        where_helper_board_id: req.params.boardId,
        who_user_name: req.session.user_info.user_name,
      });
      await Errands.Helper_board.increment(
        { helper_board_like: 1 },
        { where: { helper_board_id: { [Op.eq]: req.params.boardId } } }
      );
      res.send(true);
    } else {
      res.send(false); // 이미 좋아요 누른 게시글입니다
    }
  } catch (err) {
    res.send(err);
  }
};
