import mongoose from 'mongoose';

const categoryModel = new mongoose.Schema(
	{
		authorId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		name: { type: String, required: true },
		slug: { type: String, required: true, unique: true },
	},
	{ timestamps: true },
);

categoryModel.index({ authorId: 1 });

categoryModel.pre('save', function (next) {
	this.slug = this.slug.toLowerCase().replace(/ /g, '-');
	next();
});

export default mongoose.model('Category', categoryModel);
