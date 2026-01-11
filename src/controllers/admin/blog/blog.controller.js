import userModel from "../../../models/user.model.js";
import categoryModel from "../../../models/category.model.js";
import blogModel from "../../../models/blog.model.js";
import {uploadOnCloudinary, deleteFromCloudinary} from "../../../libs/cloudinary.js";

class AdminBlogController {
  async getBlogsPage(req, res) {
    try {
      const blogs = await blogModel.aggregate([
        {
          $lookup: {
            from: "comments",
            localField: "_id",
            foreignField: "blogId",
            as: "comments",
          },
        },
        {
          $lookup: {
            from: "categories",
            localField: "categoryId",
            foreignField: "_id",
            as: "category",
          },
        },
        {
          $addFields: {
            totalComments: {$size: "$comments"},
            category: {$arrayElemAt: ["$category", 0]},
          },
        },
        {
          $sort: {createdAt: -1},
        },
      ]);

      res.render("admin/blogs", {
        admin: req.user,
        blogs,
      });
    } catch (error) {
      console.error("Admin Get Blogs Error:", error?.message || error);
      req.flash("error", "Some thing went wrong please try again");
      return res.redirect("/admin/dashboard");
    }
  }
  async addBlogPage(req, res) {
    try {
      const categories = await categoryModel.find().select("_id name");
      if (!categories.length) {
        return res.render("admin/add-blog");
      }

      return res.render("admin/add-blog", {admin: req.user, categories});
    } catch (error) {
      console.error("Create Blog Error:", error?.message || error);
      req.flash("error", "Some thing went wrong please try again");
      return res.redirect("/admin/blogs/add");
    }
  }
  async addBlogHandler(req, res) {
    try {
      const {title, tags, content, categoryId} = req.body;
      const blogLocalImageFilePath = req?.file?.path;

      if (!blogLocalImageFilePath) {
        req.flash("error", "Blog image should be required");
        return res.redirect("/admin/blogs/add");
      }

      // Check category exists
      const category = await categoryModel.findById(categoryId);
      if (!category) {
        req.flash("error", "Category not found");
        return res.redirect("/admin/blogs/add");
      }

      // upload image to cloudinary
      const cloudinaryResponse = await uploadOnCloudinary({
        localFilePath: blogLocalImageFilePath,
      });
      if (!cloudinaryResponse) {
        req.flash("error", "Something went wrong please try again");
        return res.redirect("/admin/blogs/add");
      }

      const tagsList = tags.split(",").map((t) => t.trim()) || [];
      const newBlog = await blogModel.create({
        title,
        content,
        authorId: req?.user?.sub,
        categoryId: category?._id,
        tags: tagsList,
        image: {
          public_id: cloudinaryResponse?.public_id,
          secure_url: cloudinaryResponse?.secure_url,
        },
      });
      if (!newBlog) {
        req.flash("error", "Something went wrong please try again");
        return res.redirect("/admin/blogs/add");
      }

      req.flash("success", "Blog added successfully");
      return res.redirect("/admin/blogs");
    } catch (error) {
      console.error("Create Blog Error:", error?.message || error);
      req.flash("error", "Some thing went wrong please try again");
      return res.redirect("/admin/blogs/add");
    } finally {
      if (req?.file?.path) {
        fs.unlinkSync(req?.file?.path);
        console.log("File deleted");
      }
    }
  }
  async updateBlogPage(req, res) {
    try {
      const blog = await blogModel.findById(id);
      const categories = await categoryModel.find().select("_id name");
      if (!blog) {
        req.flash("error", "Some thing went wrong please try again");
        return res.redirect("/admin/blogs");
      }

      return res.render("admin/update-blog", {
        admin: req.user,
        blog,
        categories,
      });
    } catch (error) {
      console.error("Admin Get Update Error:", error?.message || error);
      req.flash("error", "Some thing went wrong please try again");
      return res.redirect("/admin/blogs");
    }
  }
  async updateBlogHandler(req, res) {
    try {
      const {id} = req.params;
      const {title, content, categoryId, tags} = req.body;

      const blog = await blogModel.findById(id);
      if (!blog) {
        req.flash("error", "Blog not found");
        return res.redirect("/admin/blogs");
      }

      const updateData = {
        title,
        content,
        categoryId,
        tags: tags
          ? tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
      };

      if (req.file?.path) {
        const uploaded = await uploadOnCloudinary(req.file.path, "image");

        if (uploaded) {
          await deleteFromCloudinary(blog?.image?.public_id);
          updateData.image = {
            public_id: uploaded.public_id,
            secure_url: uploaded.secure_url,
          };
        }
      }

      await blogModel.findByIdAndUpdate(id, updateData, {new: true});

      req.flash("success", "Blog updated successfully");
      return res.redirect("/admin/blogs");
    } catch (error) {
      console.error("Update Blog Error:", error);
      req.flash("error", "Something went wrong");
      return res.redirect("/admin/blogs");
    } finally {
      if (req.file?.path) {
        fs.unlinkSync(req.file.path);
        console.log("Local File deleted successfully");
      }
    }
  }
  async deleteBlogHandler(req, res) {
    const {id} = req.params;
    try {
      const deletedBlog = await blogModel.findByIdAndDelete(id);
      if (!deletedBlog) {
        req.flash("error", "Some thing went wrong please try again");
        return res.redirect("/admin/blogs");
      }

      // Delete image from the cloudinary
      await deleteFromCloudinary(deletedBlog?.image?.public_id);

      req.flash("success", "Blog deleted successfully");
      return res.redirect("/admin/blogs");
    } catch (error) {
      console.error("Admin Delete Blog Error:", error?.message || error);
      req.flash("error", "Some thing went wrong please try again");
      return res.redirect("/admin/blogs");
    }
  }
}

export default new AdminBlogController();
