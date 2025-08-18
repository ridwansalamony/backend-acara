import mongoose from "mongoose";
import { encrypt } from "../utils/encryption";
import { sendMail, renderMailHtml } from "../utils/mail/mail";
import { CLIENT_HOST, EMAIL_SMTP_USER } from "../utils/env";
import { ROLES } from "../utils/constant";
import { IUser } from "../interfaces/user.interface";
import { AppError } from "../utils/AppError";

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
      unique: true,
    },

    email: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },

    password: {
      type: Schema.Types.String,
      required: true,
    },

    role: {
      type: Schema.Types.String,
      enum: [ROLES.ADMIN, ROLES.MEMBER],
      default: ROLES.MEMBER,
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
  user.activationCode = encrypt(user.id);
  next();
});

UserSchema.post("save", async function (doc, next) {
  try {
    const user = doc;

    const contentMail = await renderMailHtml("registration-success.ejs", {
      fullname: user.fullname,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      activationLink: `${CLIENT_HOST}/auth/activation?code=${user.activationCode}`,
    });

    await sendMail({
      from: EMAIL_SMTP_USER,
      to: user.email,
      subject: "Aktivasi Akun Anda",
      html: contentMail,
    });
  } catch (error) {
    const err = error as Error;
    console.error(err.message);
  } finally {
    next();
  }
});

UserSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;
