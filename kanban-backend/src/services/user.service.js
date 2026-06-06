import { User } from "../models/user.model.js";

export const getUsersService = async () => {
  return await User.find().sort({ name: 1 });
};
