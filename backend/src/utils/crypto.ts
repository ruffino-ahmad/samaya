import crypto from "crypto";

export const encryptActivationCode = (): string => {
  const activationCode = crypto.randomBytes(16).toString("hex");
  return activationCode;
};
