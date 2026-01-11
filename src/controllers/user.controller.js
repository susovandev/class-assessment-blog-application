import userModel from "../models/user.model.js";
export const userProfilePage = async (req, res) => {
  try {
    const {sub} = req?.user;
    const user = await userModel.findById(sub);
    if (!user) {
      req.flash("error", "Your account has been deleted");
      return res.redirect("/auth/login");
    }

    return res.render("user/profile", {user});
  } catch (error) {
    console.error("User Profile Error:", error?.message || error);
    req.flash("error", "Some thing went wrong please try again");
    return res.redirect("/auth/login");
  }
};

export const updateProfilePage = async (req, res) => {
  try {
    return res.render("user/update-profile");
  } catch (error) {
    console.error("User Profile Error:", error?.message || error);
    req.flash("error", "Some thing went wrong please try again");
    return res.redirect("/auth/login");
  }
};
