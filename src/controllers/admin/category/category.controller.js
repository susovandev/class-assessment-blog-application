import userModel from "../../../models/user.model.js";
import categoryModel from "../../../models/category.model.js";

class AdminCategoryController {
  async getCategoriesPage(req, res) {
    try {
      const categories = await categoryModel.find().sort({createdAt: -1});

      return res.render("admin/categories", {admin: req.user, categories});
    } catch (error) {
      console.error("Admin get categories Error:", error?.message || error);
      req.flash("error", "Some thing went wrong please try again");
      return res.redirect("/admin/dashboard");
    }
  }
  async addCategoryHandler(req, res) {
    try {
      const {sub} = req?.user;
      const {name} = req.body;
      const newCategory = await categoryModel.create({
        authorId: sub,
        name,
      });
      if (!newCategory) {
        req.flash("error", "Some thing went wrong please try again");
        return res.redirect("/admin/categories");
      }

      req.flash("success", "Category added successfully");
      return res.redirect("/admin/categories");
    } catch (error) {
      console.error("Admin Create Category Error:", error?.message || error);
      req.flash("error", "Some thing went wrong please try again");
      return res.redirect("/admin/categories");
    }
  }
  async deleteCategoryHandler(req, res) {
    try {
      const {id} = req.params;

      const deletedCategory = await categoryModel.findByIdAndDelete(id);
      if (!deletedCategory) {
        req.flash("error", "Some thing went wrong please try again");
        return res.redirect("/admin/categories");
      }

      req.flash("success", "Category deleted successfully");
      return res.redirect("/admin/categories");
    } catch (error) {
      console.error("Admin Delete Category Error:", error?.message || error);
      req.flash("error", "Some thing went wrong please try again");
      return res.redirect("/admin/categories");
    }
  }
}

export default new AdminCategoryController();
