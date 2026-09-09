import { Errors } from "ds-express-errors";
import { TicketModel } from "../ticket/ticket.model";
import { OrderModel } from "./order.model";

const create = async (userId, payload) => {
  const { ticket, quantity, price } = payload;

  const ticketAvailable = await TicketModel.findById(ticket);
  if (!ticket) {
    throw Errors.NotFound("Ticket not found");
  }
  if (ticket.quantity < quantity) {
    throw Errors.BadRequest("Not enough ticket quantity");
  }

  const total: number = price * quantity;

  const result = await OrderModel.create({
    ticket,
    quantity,
    total,
  });

  return result;
};

export default {
  create,
};
