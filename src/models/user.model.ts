import mongoose from "mongoose";
import { encrypt } from "../utils/encryption";

export interface IUser {
  fullname: string;
  username: string;
  email: string;
  password: string;
  role: string;
  profilePicture: string;
  isActive: boolean;
  activationCode: string;
}

const Schema = mongoose.Schema;

const UserSchema = new Schema<IUser>(
  {
    fullname: {
      type: Schema.Types.String,
      required: true,
    },

    username: {
      type: Schema.Types.String,
      required: true,
    },

    email: {
      type: Schema.Types.String,
      required: true,
    },

    password: {
      type: Schema.Types.String,
      required: true,
    },

    role: {
      type: Schema.Types.String,
      enum: ["admin", "user"],
      default: "user",
    },

    profilePicture: {
      type: Schema.Types.String,
      default: "",
    },

    isActive: {
      type: Schema.Types.Boolean,
      default: false,
    },

    activationCode: {
      type: Schema.Types.String,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", function (next) {
  const user = this;
  user.password = encrypt(user.password);
  next();
});

UserSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;
