export const localsMiddleware = (req, res, next) => {
  res.locals.siteName = "Corner";
  //res.locals.routes = routes;
  res.locals.loggedUser = req.user || null;
  next();
};

export const loginRedirect = (req, res, next) => {
  req.session.returnTo = req.originalUrl;
  return next();
};

export const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.session.returnTo = req.originalUrl;
  res.redirect("/login");
};

export const logoutRedirect = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  }
  req.session.redirectTo = req.originalUrl;
  return next();
};
