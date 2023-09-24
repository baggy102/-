const Errands = require("../models");
const { Op } = require("sequelize");

// ======= User sign =======
// 로그인
exports.userLogin = async (req, res) => {
  try {
    const result = await Errands.User_info.findOne({
      where: {
        user_id: req.body.user_id,
        user_pw: req.body.user_pw,
      },
    });
    if (result != null) {
      req.session.user_info = result.dataValues;
      res.send({ user_info: result, msg: true });
    } else {
      res.send(false);
    }
  } catch (err) {
    res.send(err);
  }
};

// ID 중복 검사
exports.checkUserId = async (req, res) => {
  try {
    const result = await Errands.User_info.findOne({
      attributes: ["user_id"],
      where: { user_id: { [Op.eq]: req.body.user_id } },
    });
    console.log(result);
    if (!result) {
      return res.send(true);
    } else {
      return res.send(false);
    }
  } catch (err) {
    res.send(err);
  }
};

// 닉네임 중복검사
exports.checkUserName = async (req, res) => {
  try {
    const result = await Errands.User_info.findOne({
      attributes: ["user_name"],
      where: { user_name: req.body.user_name },
    });
    // result
    if (!result) {
      console.log("없");
      return res.send(false);
    } else {
      console.log("있");
      return res.send(true);
    }
  } catch (err) {
    res.send(err);
  }
};

// 회원가입
exports.userRegister = async (req, res) => {
  try {
    const result = await Errands.User_info.findOne({
      where: { user_id: { [Op.eq]: req.body.user_id } },
    });
    console.log(result);
    if (!result) {
      await Errands.User_info.create({
        user_id: req.body.user_id,
        user_pw: req.body.user_pw,
        user_name: req.body.user_name,
        user_type: req.body.user_type,
      });
      res.send(true);
    } else {
      res.send(false);
    }
  } catch (err) {
    res.send(err);
  }
};

// 로그아웃
exports.userLogout = (req, res) => {
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
  } catch (err) {
    res.send(err);
  }
};

// 메인페이지 상위 5명 보여주기
exports.read_few_user = async (req, res) => {
  try {
    const result = await Errands.User_info.findAll({
      order: [["user_like", "desc"]],
      limit: 5,
    });
    res.send(result);
  } catch (err) {
    res.send(err);
  }
};
// 전체 다 보여주기
exports.read_user = async (req, res) => {
  try {
    const result = await Errands.User_info.findAll({
      order: [["user_like", "desc"]],
    });
    res.send(result);
  } catch (err) {
    res.send(err);
  }
};

// detail
exports.read_detail_user = async (req, res) => {
  try {
    const result = await Errands.User_info.findOne({
      where: { id: { [Op.eq]: req.params.user } },
    });
    res.send(result);
  } catch (err) {
    res.send(err);
  }
};

// 추천수
exports.userLike = async (req, res) => {
  try {
    const result = await Errands.User_info.increment(
      { user_like: 1 },
      { where: { id: { [Op.eq]: req.params.user } } }
    );
    res.send(result);
  } catch (err) {
    res.send(err);
  }
};

// 회원탈퇴
exports.userWithdrawal = async (req, res) => {
  try {
    const auth = await Errands.User_info.findOne({
      attributes: ["user_name"],
      where: { id: { [Op.eq]: req.params.userId } },
    });
    if (auth.dataValues.user_name == req.session.user_info.user_name) {
      const result = await Errands.User_info.destroy({
        where: { id: { [Op.eq]: req.params.userId } },
      });
      if (!result) {
        res.send(false);
      } else {
        req.session.destroy();
        res.send(true);
      }
    }
  } catch (err) {
    res.send(err);
  }
};
// 회원정보 수정
exports.userUpdate = async (req, res) => {
  try {
    const auth = await Errands.User_info.findOne({
      attributes: ["user_name"],
      where: { user_name: { [Op.eq]: req.session.user_info.user_name } },
    });
    if (auth.dataValues.user_name == req.session.user_info.user_name) {
      const [result] = await Errands.User_info.update(
        {
          user_id: req.body.user_id,
          user_pw: req.body.user_pw,
          user_name: req.body.user_name,
          user_type: req.body.user_type,
        },
        { where: { id: { [Op.eq]: req.params.userId } } }
      );
      if (result === 0) {
        console.log(result);
        return res.send(false);
      } else {
        //   const update_session = await Errands.User_info.findOne({
        //     where: {
        //       user_id: req.session.user_id,
        //       user_pw: req.session.user_pw,
        //     },
        //   });
        //   req.session.user_info = update_session.dataValues;
        res.send(true);
      }
    }
  } catch (err) {
    res.send(err);
  }
};

exports.user_wanter_board = async (req, res) => {
  try {
    const result = await Errands.Wanter_board.findAll({
      where: { wanter_board_writer: { [Op.eq]: req.body.user_name } },
    });
    res.send(result);
  } catch (err) {
    res.send(err);
  }
};

exports.user_helper_board = async (req, res) => {
  try {
    const result = await Errands.Helper_board.findAll({
      where: { helper_board_writer: { [Op.eq]: req.body.user_name } },
    });
    console.log(result);
    res.send(result);
  } catch (err) {
    res.send(err);
  }
};

exports.set_user_img = async (req, res) => {
  try {
    const [result] = await Errands.User_info.update(
      {
        user_img: req.file.filename,
      },
      {
        where: { id: { [Op.eq]: req.params.user } },
      }
    );
    if (result === 0) {
      return res.send(false);
    } else {
      res.send(true);
    }
  } catch (err) {
    res.send(err);
  }
};

exports.user_like = async (req, res) => {
  try {
    if (!req.session.user_info) {
      const search = await Errands.User_info.findOne({
        where: { id: { [Op.eq]: req.params.user } },
      });
      if (!search) {
        res.send("오류임 모름이건");
      } else {
        search.addFollowing(parseInt(req.params.user, 10));
        res.send(true);
      }
    } else {
      res.send("로그인하시오");
    }
  } catch (err) {
    res.send(err);
  }
};
