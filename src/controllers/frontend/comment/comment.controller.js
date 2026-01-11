import commentModel from "../../../models/comment.model.js";

class CommentController {
  async addComment(req, res) {
    try {
      const {content} = req.body;
      console.log("BLOG ID", req.params.id);

      const newComment = await commentModel.create({
        content,
        blogId: req.params.id,
        userId: req.user?.sub,
      });
      if (!newComment) {
        req.flash("error", "Some thing went wrong please try again");
        return res.redirect("/blogs/" + req.params.id);
      }

      req.flash("success", "Comment added successfully");
      return res.redirect("/blogs/" + req.params.id);
    } catch (error) {
      console.error(`Add Comment Error:`, error?.message || error);
      req.flash("error", "Some thing went wrong please try again");
      return res.redirect("/blogs/" + req.params.id);
    }
  }
}
export default new CommentController();
