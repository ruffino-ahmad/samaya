import { type Response } from "express";
import { type IReqUser } from "../../middlewares/auth-middleware";
import orderService from "./order.service";
import sendResponse from "../../utils/response";

const create = async (req: IReqUser, res: Response) => {
  const userId = req.user?.id;
  const payload = {
    ...req.body,
    createdBy: userId,
  };

  const result = await orderService.create(userId, payload);
  return sendResponse(res, {
    statusCode: 201,
    message: "Order created successfully",
    data: result,
  });
};

const findAll = async (req: IReqUser, res: Response) => {};
const findOne = async (req: IReqUser, res: Response) => {};
const findAllByMember = async (req: IReqUser, res: Response) => {};
const complete = async (req: IReqUser, res: Response) => {};
const pending = async (req: IReqUser, res: Response) => {};
const cancelled = async (req: IReqUser, res: Response) => {};

export default {
  create,
  findAll,
  findOne,
  findAllByMember,
  complete,
  pending,
  cancelled,
};
