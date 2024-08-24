import bcrypt from "bcrypt";
import User from "../models/User";
import Product from "../models/Product";

export const getJoin = async (req, res) => {};

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

export const getLogin = async (req, res) => {};

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

export const getLogout = async (req, res) => {
  const { user } = req.session;
  return res.status(201).json({ user });
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

  if (email !== user.email) {
    const useremailExists = await User.exists({ email });
    if (useremailExists) {
      return res
        .status(401)
        .json({ errorMessage: "해당 이메일은 다른 유저가 사용중 입니다" });
    }
  }

  if (newPassword != +newPassword2) {
    return res
      .status(401)
      .json({ errorMessage: "새로운 비밀번호가 일치하지 않습니다" });
  }
  if (oldPassword === newPassword && oldPassword != "") {
    return res.status(401).json({ errorMessage: "이전 비밀번호랑 동일합니다" });
  }

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (oldPassword != "") {
    if (!isMatch) {
      return res
        .status(401)
        .json({ errorMessage: "기존 비밀번호가 일치하지 않습니다" });
    }
  }

  let hashedPassword = "";
  const changePassword = await bcrypt.hash(newPassword, 10);
  if (oldPassword === "" && newPassword === "" && newPassword2 === "") {
    hashedPassword = user.password;
  } else {
    hashedPassword = changePassword;
  }

  const updateUser = await User.findByIdAndUpdate(
    user._id,
    {
      name,
      email,
      password: hashedPassword,
    },
    { new: true }
  );
  req.session.user = updateUser;
  try {
    return res.sendStatus(201);
  } catch (error) {
    console.error(error);
  }
};

export const getCart = async (req, res) => {
  const { user } = req.session;
  return res.status(201).json({ user });
};

export const getAddToCart = async (req, res) => {
  const { user } = req.session;
  return res.status(201).json({ user });
};

export const postAddToCart = async (req, res) => {
  const productId = req.body.id;
  const userinfo = req.session.user;

  const user = await User.findOne({ _id: userinfo._id });
  try {
    let duplicate = false;
    user.cart.new.forEach((item) => {
      if (item.id === productId) {
        duplicate = true;
      }
    });

    if (duplicate) {
      const updateUser = await User.findOneAndUpdate(
        { _id: user._id, "cart.new.id": productId },
        { $inc: { "cart.new.$.quantity": 1 } },
        { new: true }
      );
      req.session.user.cart = updateUser;
    } else {
      const updateUser = await User.findByIdAndUpdate(
        { _id: user._id },
        {
          $push: {
            "cart.new": {
              id: productId,
              quantity: 1,
              date: Date.now(),
            },
          },
        },
        { new: true }
      );
      req.session.user.cart = updateUser;
    }

    return res.status(201).send(user.cart);
  } catch (error) {
    console.error(error);
  }
};

export const getAddUsedToCart = async (req, res) => {
  const { id } = req.params;
  const { user } = req.session;
  const product = await Product.find({ _id: id });

  return res.status(201).json({ product, user });
};

export const postAddUsedToCart = async (req, res) => {
  const productId = req.body.id;
  const userinfo = req.session.user;

  const user = await User.findOne({ _id: userinfo._id });
  try {
    let dulicate = false;
    user.cart.used.forEach((item) => {
      if (item.id === productId) {
        dulicate = true;
      }
    });
    if (dulicate) {
      const updateUser = await User.findOneAndUpdate(
        { _id: user._id, "cart.used.id": productId },
        { $inc: { "cart.used.$.quantity": 1 } },
        { new: true }
      );
      req.session.user.cart = updateUser;
    } else {
      const updateUser = await User.findByIdAndUpdate(
        { _id: user._id },
        {
          $push: {
            "cart.used": {
              id: productId,
              quantity: 1,
              data: Date.now(),
            },
          },
        },
        { new: true }
      );
      req.session.user.cart = updateUser;
    }
    return res.sendStatus(201);
  } catch (error) {
    console.error(error);
  }
};
