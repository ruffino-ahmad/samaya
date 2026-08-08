import UserModel from "../models/user-model.js";
import type { TCreateUser, TLogin } from "../validations/auth-validation.js";
import { comparePassword, hashPassword } from "../utils/hash.js";
import { Errors } from "ds-express-errors";
import { generateAccessToken } from "../utils/jwt.js";
import { encryptActivationCode } from "../utils/crypto.js";
import { APP_BASE_URL } from "../utils/env.js";
import queueClient from "../config/queueClient.js";

const register = async (payload: TCreateUser) => {
  const { fullname, username, email, password } = payload;

  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    throw Errors.Conflict("Email already exists");
  }

  const hashedPassword = await hashPassword(password);

  const activationCode = encryptActivationCode();
  const activationCodeExpires = new Date(
    Date.now() + 24 * 60 * 60 * 1000,
  ).toISOString(); // Expires in 24 hours

  const result = await UserModel.create({
    fullname,
    username,
    email,
    password: hashedPassword,
    activationCode,
    activationCodeExpires,
  });

  const activationLink = `${APP_BASE_URL}/auth/activation?code=${activationCode}`;
  const payloadEmail = { toEmail: email, activationLink };
  const messageText = Buffer.from(JSON.stringify(payloadEmail)).toString(
    "base64",
  );

  await queueClient.sendMessage(messageText);

  return result;
};

const login = async (payload: TLogin) => {
  const { identifier, password } = payload;

  const userByIdentifier = await UserModel.findOne({
    $or: [
      {
        username: identifier,
      },
      {
        email: identifier,
      },
    ],
  });

  if (!userByIdentifier) {
    throw Errors.Forbidden("Invalid email/username or password");
  }

  const comparePasswordResult: boolean = await comparePassword(
    password,
    userByIdentifier.password,
  );
  if (!comparePasswordResult) {
    throw Errors.Forbidden("Invalid email/username or password");
  }

  const token = generateAccessToken({
    id: userByIdentifier._id,
    role: userByIdentifier.role,
  });

  return token;
};

const me = async (id: string) => {
  const result = await UserModel.findById(id);
  return result;
};

const activationAccount = async (activationCode: string) => {
  const user = await UserModel.findOneAndUpdate(
    {
      activationCode,
      activationCodeExpires: { $gt: new Date() },
    },
    {
      $set: {
        isActive: true,
      },
      $unset: {
        activationCode: "",
        activationCodeExpires: "",
      },
    },
    {
      returnDocument: "after",
    },
  );

  if (!user) {
    throw Errors.BadRequest("Invalid or expired activation code");
  }

  return user;
};

export default { register, login, me, activationAccount };
