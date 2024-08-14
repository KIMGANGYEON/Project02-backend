import bcrypt from "bcrypt";
import User from "../models/User";

export const postJoin = async (req, res) => {
  const { name, email, password, password2 } = req.body;

  const useremailExists = await User.exists({ email });
  if (useremailExists) {
    return res
      .status(401)
      .json({ errorMessage: "해당 이메일을 다른 유저가 사용중 입니다" });
  }

  if (password != password2) {
    return res
      .status(401)
      .json({ errorMessage: "비밀번호가 일치하지 않습니다" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    return res.sendStatus(201);
  } catch (error) {
    return res.status(500).json({ errorMessage: "서버 에러" });
  }
};

export const postLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ errorMessage: "이메일을 다시 확인해 주세요" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ errorMessage: "비밀번호가 일치하지 않습니다" });
    }
    req.session.user = user;
    req.session.isLoggedIn = true;
    await req.session.save();

    return res.sendStatus(201);
  } catch (error) {
    console.error(error);
  }
};

export const postLogout = async (req, res) => {
  res.clearCookie("connect.sid", {
    httpOnly: true,
  });
  req.session.destroy();

  return res.sendStatus(201);
};

export const getUserEdit = async (req, res) => {
  const { user } = req.session;

  return res.status(201).json({ user });
};

export const postUserEdit = async (req, res) => {
  const { user } = req.session;
  let { name, email, oldPassword, newPassword, newPassword2 } = req.body;

  if (name === "") {
    name = user.name;
  }
  if (email === "") {
    email = user.email;
  }
  if (oldPassword != "" && newPassword === "" && newPassword2 === "") {
    return res
      .status(401)
      .json({ errorMessage: "새로운 비밀번호를 입력해 주세요" });
  }
  if (oldPassword != "" && newPassword != "" && newPassword2 === "") {
    return res
      .status(401)
      .json({ errorMessage: "새로운 확인 비밀번호를 입력해 주세요" });
  }
  if (oldPassword === "" && newPassword != "" && newPassword2 === "") {
    return res
      .status(401)
      .json({ errorMessage: "기존 비밀번호를 입력해 주세요" });
  }
  if (oldPassword === "" && newPassword === "" && newPassword2 != "") {
    return res
      .status(401)
      .json({ errorMessage: "기존 비밀번호를 입력해 주세요" });
  }
  if (oldPassword === "" && newPassword === "" && newPassword2 != "") {
    return res
      .status(401)
      .json({ errorMessage: "기존 비밀번호를 입력해 주세요" });
  }
  if (oldPassword != "" && newPassword === "" && newPassword2 != "") {
    return res
      .status(401)
      .json({ errorMessage: "새로운 비밀번호를 입력해 주세요" });
  }

  const updateUser = await User.findOne({ _id: user._id });

  if (email !== updateUser.email) {
    const useremailExists = await User.exists({ email });
    if (useremailExists) {
      return res
        .status(401)
        .json({ errorMessage: "해당 이메일은 다른 유저가 사용중 입니다" });
    }
  }
  try {
    return res.sendStatus(201);
  } catch (error) {
    console.error(error);
  }
};
