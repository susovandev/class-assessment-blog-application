import blogModel from "../../../models/blog.model.js";
import categoryModel from "../../../models/category.model.js";
import commentModel from "../../../models/comment.model.js";

class BlogController {
  async renderBlogPage(req, res) {
    try {
      // Get all the blogs with author details
      const blogsWithAuthorInformation = await blogModel.find().populate({
        path: "authorId",
        select: "username profileImage",
      });

      // Get all the categories with total blogs
      const categoriesWithTotalBlogs = await categoryModel.aggregate([
        {
          $lookup: {
            from: "blogs",
            localField: "_id",
            foreignField: "categoryId",
            as: "blogs",
          },
        },
        {
          $addFields: {
            totalBlogs: {$size: "$blogs"},
          },
        },
        {
          $sort: {
            totalBlogs: -1,
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            totalBlogs: 1,
          },
        },
      ]);

      // Get recent posts
      const recentCreatedBlogs = await blogModel
        .find()
        .sort({createdAt: -1})
        .limit(5)
        .select("_id title image createdAt");
      return res.render("frontend/blog/blogs", {
        blogs: blogsWithAuthorInformation,
        categories: categoriesWithTotalBlogs,
        recentBlogsList: recentCreatedBlogs,
      });
    } catch (error) {
      console.error("Admin Get Blogs Error:", error?.message || error);
      return res.redirect("/blogs");
    }
  }
  async getBlogDetailsPage(req, res) {
    const {id} = req.params;

    const blog = await blogModel
      .findById(id)
      .populate("authorId", "username profileImage")
      .populate("categoryId", "name slug");
    if (!blog) {
      return res.redirect("/blogs");
    }

    const comments = await commentModel
      .find({
        blogId: blog._id,
      })
      .populate({
        path: "userId",
        select: "profileImage role username email createdAt",
      })
      .sort({createdAt: -1});

    return res.render("frontend/blog/blog-single", {
      blog,
      comments,
    });
  }
}

export default new BlogController();
