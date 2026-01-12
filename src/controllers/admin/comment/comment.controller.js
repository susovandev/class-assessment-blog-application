import commentModel from '../../../models/comment.model.js';
class AdminCommentController {
  async getCommentAnalytics(req, res) {
    try {
      // Total comments
      const totalComments = await commentModel.countDocuments();
      // Total active comments
      const activeComments = await commentModel.countDocuments({
        isActive: true,
      });
      // Total hidden comments
      const hiddenComments = await commentModel.countDocuments({
        isActive: false,
      });

      const blogStats = await commentModel.aggregate([
        {
          $group: {
            _id: '$blogId',
            totalComments: { $sum: 1 },
            activeComments: {
              $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] },
            },
            hiddenComments: {
              $sum: { $cond: [{ $eq: ['$isActive', false] }, 1, 0] },
            },
          },
        },
        {
          $lookup: {
            from: 'blogs',
            localField: '_id',
            foreignField: '_id',
            as: 'blog',
          },
        },
        { $unwind: '$blog' },
        {
          $project: {
            blogId: '$blog._id',
            title: '$blog.title',
            totalComments: 1,
            activeComments: 1,
            hiddenComments: 1,
          },
        },
        { $sort: { totalComments: -1 } },
      ]);

      const topBlog = blogStats.length ? blogStats[0] : null;

      const recentComments = await commentModel
        .find()
        .populate({ path: 'userId', select: 'username', strictPopulate: false })
        .populate({ path: 'blogId', select: 'title', strictPopulate: false })
        .sort({ createdAt: -1 })
        .limit(10);

      return res.render('admin/comment-analytics', {
        admin: req.user,
        stats: {
          totalComments,
          activeComments,
          hiddenComments,
          topBlog,
        },
        blogStats,
        recentComments,
      });
    } catch (error) {
      console.error('Comment Analytics Error:', error);
      req.flash('error', 'Failed to load comment analytics');
      return res.redirect('/admin/dashboard');
    }
  }
}

export default new AdminCommentController();
