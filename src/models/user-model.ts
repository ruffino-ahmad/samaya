import mongoose from "mongoose";

export interface User {
  fullname: string;
  username: string;
  email: string;
  password: string;
  role: string;
  profilePicture: string;
  isActive: boolean;
  activationCode: string;
}

const UserSchema = new mongoose.Schema<User>(
  {
    fullname: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    profilePicture: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    activationCode: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

UserSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.__v;
  return user;
};

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;
