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
  const data = req.session;

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
  try {
    req.session.user = user;
    req.session.isLoggedIn = true;
    console.log(data);
    return res.sendStatus(201);
  } catch (error) {
    console.error(error);
  }
};
