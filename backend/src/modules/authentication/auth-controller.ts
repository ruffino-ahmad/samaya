import type { Request, Response } from "express";

import authService from "./auth-services.js";

import {
  type ActivationCodeInput,
  type LoginInput,
  type RegisterInput,
} from "./auth-validation.js";
import type { IReqUser } from "../../middlewares/auth-middleware.js";
import sendResponse, { HTTPStatusCode } from "../../utils/response.js";

const register = async (req: Request, res: Response) => {
  const { fullname, username, email, password } = req.body as RegisterInput;

  const result = await authService.register({
    fullname,
    username,
    email,
    password,
  });

  return sendResponse(res, {
    statusCode: HTTPStatusCode.CREATED,
    message: "Register validation successful",
    data: result,
  });
};

const login = async (req: Request, res: Response) => {
  const { identifier, password } = req.body as LoginInput;

  const result = await authService.login({
    identifier,
    password,
  });

  return sendResponse(res, {
    statusCode: HTTPStatusCode.OK,
    message: "Login validation successful",
    data: result,
  });
};

const me = async (req: IReqUser, res: Response) => {
  const result = await authService.me(req.user?.id?.toString() ?? "");

  return sendResponse(res, {
    statusCode: HTTPStatusCode.OK,
    message: "Get User Profile successful",
    data: result,
  });
};

const activationAccount = async (req: Request, res: Response) => {
  const { activationCode } = req.body as ActivationCodeInput;

  const user = await authService.activationAccount(activationCode);

  return sendResponse(res, {
    statusCode: HTTPStatusCode.OK,
    message: "Account activation successful",
    data: user,
  });
};

export default { register, login, me, activationAccount };
