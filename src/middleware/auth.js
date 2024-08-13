export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loggedInUser = req.session.user || {};
  next();
};

export const Auth = (req, res, next) => {
  if (!req.session.user)
    return res.status(401).json({ errorMessage: "인증된 유저가 아님니다" });
};
