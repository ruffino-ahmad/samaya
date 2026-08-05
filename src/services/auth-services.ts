import UserModel from "../models/user-model.js";
import type { TCreateUser, TLogin } from "../validations/auth-validation.js";
import { comparePassword, hashPassword } from "../utils/hash.js";
import { AppError, Errors } from "ds-express-errors";
import { generateAccessToken } from "../utils/jwt.js";
import type { IReqUser } from "../middlewares/auth-middleware.js";

const register = async (payload: TCreateUser) => {
  const { fullname, username, email, password } = payload;

  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    throw Errors.Conflict("Email already exists");
  }

  const hashedPassword = await hashPassword(password);

  const result = await UserModel.create({
    fullname,
    username,
    email,
    password: hashedPassword,
  });

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

export default { register, login, me };
