export const RoleGuard = (...roles) => {
  return (req, res, next) => {
    try {
      const user = req.user;

      if (!user || !roles.includes(user?.role)) {
        req.flash(
          'error',
          'You do not have permission to access this resource'
        );
        return res.redirect('/auth/login');
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
