const Errands = require("../models");
const { Op } = require("sequelize");

// ======= Wanter_board =======
// 매인페이지에 5개 보여주기 deadline순 5개
exports.read_few_wanter_board = async (req, res) => {
  try {
    const result = await Errands.Wanter_board.findAll({
      where: { wanter_board_done: { [Op.eq]: 0 } },
      order: [["wanter_board_dead_line", "desc"]],
      limit: 5,
    });
    console.log(req.session);
    res.send(result);
  } catch (err) {
    res.send(err);
  }
};

// 전체 다 보여주기
exports.read_wanter_board = async (req, res) => {
  try {
    const result = await Errands.Wanter_board.findAll({
      order: [["wanter_board_date", "asc"]],
    });
    res.send(result);

    //
  } catch (err) {
    res.send(err);
  }
};

// 게시물 하나만 보여주기
exports.read_one_wanter_board = async (req, res) => {
  try {
    const result = await Errands.Wanter_board.findOne({
      where: { wanter_board_id: { [Op.eq]: req.params.boardId } },
    });
    res.send(result);
  } catch (err) {
    res.send(err);
  }
};

// 게시물 생성
exports.create_wanter_board = async (req, res) => {
  try {
    if (!req.session.user_info) {
      res.send("로그인하시오");
    } else {
      const result = await Errands.Wanter_board.create({
        wanter_board_writer: req.session.user_info.user_name,
        wanter_board_title: req.body.wanter_board_title,
        wanter_board_content: req.body.wanter_board_content,
        wanter_board_place: req.body.wanter_board_place,
        wanter_board_dead_line: req.body.wanter_board_dead_line,
        wanter_board_place_detail: req.body.wanter_board_place_detail,
        wanter_board_done: false,
      });
      res.send(result);
    }
  } catch (err) {
    res.send(err);
  }
};

// 게시물 수정
exports.update_wanter_board = async (req, res) => {
  try {
    if (!req.session.user_info) {
      res.send("로그인하시오");
    } else {
      const auth = await Errands.Wanter_board.findOne({
        attributes: ["wanter_board_writer"],
        where: { wanter_board_id: { [Op.eq]: req.params.boardId } },
      });
      if (
        auth.dataValues.wanter_board_writer !== req.session.user_info_user_name
      ) {
        res.send("작성자만 수정가능");
      } else {
        const [result] = await Errands.Wanter_board.update(
          {
            wanter_board_title: req.body.wanter_board_title,
            wanter_board_content: req.body.wanter_board_place,
            wanter_board_place: req.body.wanter_board_place,
            wanter_board_done: req.body.done,
          },
          { where: { wanter_board_id: { [Op.eq]: req.params.boardId } } }
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
exports.delete_wanter_board = async (req, res) => {
  try {
    const auth = await Errands.Wanter_board.findOne({
      attributes: ["wanter_board_writer"],
      where: { wanter_board_id: { [Op.eq]: req.params.boardId } },
    });
    if (
      auth.dataValues.wanter_board_writer !== req.session.user_info.user_name
    ) {
      res.send("작성자만 삭제 가능");
    } else {
      const result = await Errands.Wanter_board.destroy({
        where: {
          wanter_board_id: { [Op.eq]: req.params.boardId },
        },
      });
      if (!result) {
        return res.send(false);
      }
      res.send(true);
    }
  } catch (err) {
    res.send(err);
  }
};

// 조회수 up
exports.hit_wanter_board = async (req, res) => {
  try {
    const result = await Errands.Wanter_board.increment(
      { wanter_board_hit: 1 },
      { where: { wanter_board_id: { [Op.eq]: req.params.boardId } } }
    );
    res.send(result);
  } catch (err) {
    res.send(err);
  }
};

// 검색
exports.search_wanter_board = async (req, res) => {
  try {
    const { boardType, optionValue } = req.params;
    const search = req.query.search;
    if (boardType == "wanter") {
      if (optionValue == "wanter_board_writer") {
        const result = await Errands.Wanter_board.findAll({
          where: {
            wanter_board_writer: { [Op.like]: `%${search}%` },
          },
        });
        console.log("====");
        console.log(req.params);
        console.log(result);
        res.send(result);
      } else if (optionValue === "wanter_board_title") {
        const result = await Errands.Wanter_board.findAll({
          where: {
            wanter_board_title: { [Op.like]: `%${search}%` },
          },
        });
        res.send(result);
      } else if (optionValue === "wanter_board_place") {
        const result = await Errands.Wanter_board.findAll({
          where: {
            wanter_board_place: { [Op.like]: `%${search}%` },
          },
        });
        res.send(result);
      }
    } else if (boardType == "helper") {
      if (optionValue == "helper_board_writer") {
        const result = await Errands.Helper_board.findAll({
          where: {
            helper_board_writer: { [Op.like]: `%${search}%` },
          },
        });
        console.log("====");
        console.log(req.params);
        console.log(result);
        res.send(result);
      } else if (optionValue === "helper_board_title") {
        const result = await Errands.Helper_board.findAll({
          where: {
            helper_board_title: { [Op.like]: `%${search}%` },
          },
        });
        res.send(result);
      } else if (optionValue === "wanter_board_place") {
        const result = await Errands.Helper_board.findAll({
          where: {
            helper_board_place: { [Op.like]: `%${search}%` },
          },
        });
        res.send(result);
      }
    } else {
      res.send("알 수 없는 오류");
    }
  } catch (err) {
    res.send(err);
  }
};

// 게시물 done, proceeding params -> session 변경

// 게시물 done 처리
exports.done_wanter_board = async (req, res) => {
  try {
    if (!req.session.user_info) {
      res.send("로그인하시오");
    } else {
      const auth = await Errands.Wanter_board.findOne({
        attributes: ["wanter_board_writer"],
        where: { wanter_board_id: { [Op.eq]: req.params.boardId } },
      });
      if (
        auth.dataValues.wanter_board_writer !== req.session.user_info.user_name
      ) {
        res.send("작성자만 완료가능");
      } else {
        const [result] = await Errands.Wanter_board.update(
          {
            wanter_board_done: true,
          },
          { where: { wanter_board_id: { [Op.eq]: req.params.boardId } } }
        );
        console.log("========");
        console.log(result);
        if (result === 0) {
          res.send(false);
        } else {
          res.send(true);
        }
      }
    }
  } catch (err) {
    res.send(err);
  }
};

exports.wanter_board_like = async (req, res) => {
  try {
    const auth = await Errands.Who_wanter_like.findOne({
      where: {
        where_wanter_board_id: { [Op.eq]: req.params.boardId },
        who_user_name: { [Op.eq]: req.session.user_info.user_name },
      },
    });
    if (!auth) {
      await Errands.Who_wanter_like.create({
        where_wanter_board_id: req.params.boardId,
        who_user_name: req.session.user_info.user_name,
      });
      await Errands.Wanter_board.increment(
        { wanter_board_like: 1 },
        { where: { wanter_board_id: { [Op.eq]: req.params.boardId } } }
      );
      res.send(true);
    } else {
      res.send(false); // 이미 좋아요 누른 게시글입니다
    }
  } catch (err) {
    res.send(err);
  }
};

// 게시물 진행 중 처리
// exports.proceed_wanter_board = async (req, res) => {
//   try {
//     // if (!req.session.user_info) {
//     //   res.send("로그인하시오");
//     // } else {
//     const auth = await Errands.Wanter_board.findOne({
//       attributes: ["wanter_board_writer"],
//       where: { wanter_board_id: { [Op.eq]: req.params.boardId } },
//     });
//     if (auth.dataValues.wanter_board_writer !== req.body.user_name) {
//       res.send("작성자만 완료가능");
//     } else {
//       const [result] = await Errands.Wanter_board.update(
//         {
//           wanter_board_done: 2,
//           // true 값 대신 다른 값으로 변경 (database 설정 추가 해야 함)
//         },
//         { where: { wanter_board_id: { [Op.eq]: req.params.boardId } } }
//       );
//       console.log("========");
//       console.log(result);
//       if (result === 0) {
//         res.send(false);
//       } else {
//         res.send(true);
//       }
//     }
//   } catch (err) {
//     res.send(err);
//   }
// };
