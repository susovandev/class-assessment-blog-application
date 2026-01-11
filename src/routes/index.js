import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import frontendRoutes from "./frontend/frontend.routes.js";
import adminDashboardRoutes from "./admin/dashboard/dashboard.routes.js";
import adminBlogRoutes from "./admin/blog/blog.routes.js";
import adminCategoryRoutes from "./admin/category/category.routes.js";
import adminUserRoutes from "./admin/user/user.routes.js";
import adminCommentRoutes from "./admin/comments/comment.routes.js";

import blogRoutes from "./frontend/blog/blog.routes.js";
import commentRoutes from "./frontend/comment/comment.routes.js";

export default function configureRoutes(app) {
  app.use("/auth", authRoutes);
  app.use("/user", userRoutes);
  app.use("/admin/dashboard", adminDashboardRoutes);
  app.use("/admin/blogs", adminBlogRoutes);
  app.use("/admin/categories", adminCategoryRoutes);
  app.use("/admin/users", adminUserRoutes);
  app.use("/admin/comments", adminCommentRoutes);

  app.use("/blogs", blogRoutes);
  app.use("/comments", commentRoutes);
  app.use(frontendRoutes);
}
