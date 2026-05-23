import { customAlphabet } from "nanoid";
import subscriberModel from "../models/subscriberModel.js";

const nanoid = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ23456789", 6);

export const generateUniqueCode = async (prefix) => {
  let code, exists;

  do {
    code = `${prefix}-${nanoid()}`;
    exists = await subscriberModel.findOne({ code });
  } while (exists);

  return code;
};
