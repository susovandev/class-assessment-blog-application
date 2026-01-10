import mongoose from 'mongoose';

const categoryModel = new mongoose.Schema(
	{
		authorId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		name: { type: String, required: true },
		slug: { type: String, unique: true },
	},
	{ timestamps: true },
);

categoryModel.index({ authorId: 1 });

categoryModel.pre('save', function () {
	this.slug = this.name.toLowerCase().replace(/ /g, '-');
});

export default mongoose.model('Category', categoryModel);
