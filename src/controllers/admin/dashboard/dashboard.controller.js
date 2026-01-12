import userModel from '../../../models/user.model.js';
import categoryModel from '../../../models/category.model.js';
import blogModel from '../../../models/blog.model.js';
import commentModel from '../../../models/comment.model.js';
class AdminDashBoardController {
  async adminDashBoardPage(req, res) {
    try {
      const [totalUsers, totalCategories, totalBlogs, totalComments] =
        await Promise.all([
          userModel.countDocuments({ role: 'user' }),
          categoryModel.countDocuments(),
          blogModel.countDocuments(),
          commentModel.countDocuments(),
        ]);

      res.render('admin/dashboard', {
        admin: req.user,
        stats: {
          totalUsers,
          totalCategories,
          totalBlogs,
          totalComments,
        },
      });
    } catch (error) {
      console.error('Admin DashboardError:', error?.message || error);
      req.flash('error', 'Some thing went wrong please try again');
      return res.redirect('/admin/dashboard');
    }
  }
}

export default new AdminDashBoardController();
