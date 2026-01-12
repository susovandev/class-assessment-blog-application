import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    password: { type: String, required: true },
    profileImage: {
      secure_url: {
        type: String,
      },
      public_id: {
        type: String,
      },
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    refreshToken: { type: String, select: false },
    isActive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.pre('save', function () {
  this.profileImage.secure_url =
    this.profileImage.secure_url ??
    `https://ui-avatars.com/api/?name=${this.username}`;
});

export default mongoose.model('User', userSchema);
