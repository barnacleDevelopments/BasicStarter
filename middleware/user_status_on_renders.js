/**
 * @description add user status to each view engine render
 */

const userMiddleware = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.locals.userAuthenticated = true;
  }
  next();
};

export default userMiddleware;
