import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    image: {
      secure_url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: [String],
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
  },
  { timestamps: true }
);

blogSchema.index({ authorId: 1 });
blogSchema.index({ category: 1 });

export default mongoose.model('Blog', blogSchema);
