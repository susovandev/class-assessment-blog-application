import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
	{
		content: { type: String, required: true },
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		blogId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Blog',
			required: true,
		},
		isActive: {
			type: Boolean,
			default: true,
		},
		replies: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Reply',
			},
		],
	},
	{ timestamps: true },
);

commentSchema.index({ userId: 1 });
commentSchema.index({ blogId: 1 });

export default mongoose.model('Comment', commentSchema);
