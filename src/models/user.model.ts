import mongoose from "mongoose";
import { encrypt } from "../utils/encryption";
import { sendMail, renderMailHtml } from "../utils/mail/mail";
import { CLIENT_HOST, EMAIL_SMTP_USER } from "../utils/env";

export interface IUser {
  fullname: string;
  username: string;
  email: string;
  password: string;
  role: string;
  profilePicture: string;
  isActive: boolean;
  activationCode: string;
  createdAt?: string;
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

UserSchema.post("save", async function (doc, next) {
  try {
    const user = doc;

    console.log("send email to: " + user);

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
    console.log(err.message);
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
