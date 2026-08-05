import type { Request, Response } from "express";

import authService from "../services/auth-services.js";

import { type TLogin, type TRegister } from "../validations/auth-validation.js";
import type { IReqUser } from "../middlewares/auth-middleware.js";

const register = async (req: Request, res: Response) => {
  const { fullname, username, email, password } = req.body as TRegister;

  const result = await authService.register({
    fullname,
    username,
    email,
    password,
  });

  res.status(200).json({
    message: "Register validation successful",
    data: result,
  });
};

const login = async (req: Request, res: Response) => {
  const { identifier, password } = req.body as TLogin;

  const result = await authService.login({
    identifier,
    password,
  });

  res.status(200).json({
    message: "Login validation successful",
    data: result,
  });
};

const me = async (req: IReqUser, res: Response) => {
  const result = await authService.me(req.user?.id?.toString() ?? "");

  res.status(200).json({
    message: "Get User Profile successful",
    data: result,
  });
};

export default { register, login, me };
