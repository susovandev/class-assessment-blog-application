import mongoose from 'mongoose';

const replySchema = new mongoose.Schema(
	{
		content: { type: String, required: true },
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		commentId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Comment',
			required: true,
		},
	},
	{ timestamps: true },
);

replySchema.index({ authorId: 1 });
replySchema.index({ commentId: 1 });

export default mongoose.model('Reply', replySchema);
