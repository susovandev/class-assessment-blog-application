import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {type: String, required: true},
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    password: {type: String, required: true},
    profileImage: {
      secure_url: {
        type: String,
        default: "https://res.cloudinary.com/dyq0n4tgn/image/upload/v1665001289/default-image.jpg",
      },
      public_id: {
        type: String,
        default: "default-image",
      },
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    refreshToken: {type: String, select: false},
    isActive: {type: Boolean, default: false},
  },
  {timestamps: true}
);

export default mongoose.model("User", userSchema);
