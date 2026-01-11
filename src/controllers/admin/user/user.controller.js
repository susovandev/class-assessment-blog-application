import userModel from "../../../models/user.model.js";

class AdminUserController {
  async getUsersPage(req, res) {
    try {
      const users = await userModel.find({role: {$ne: "admin"}}).select("-password");

      res.render("admin/users", {
        admin: req.user,
        users,
      });
    } catch (error) {
      console.error("Admin get users Error:", error?.message || error);
      req.flash("error", "Some thing went wrong please try again");
      return res.redirect("/admin/dashboard");
    }
  }

  async toggleUserStatus(req, res) {
    try {
      const {id} = req.params;
      const user = await userModel.findById(id);

      if (user.role === "admin") {
        req.flash("error", "Admin account cannot be disabled");
        return res.redirect("/admin/users");
      }

      user.isActive = !user.isActive;
      await user.save();

      req.flash("success", `User ${user.isActive ? "enabled" : "disabled"} successfully`);

      res.redirect("/admin/users");
    } catch (error) {
      console.error("Admin toggle user status Error:", error?.message || error);
      req.flash("error", "Some thing went wrong please try again");
      return res.redirect("/admin/dashboard");
    }
  }
}

export default new AdminUserController();
