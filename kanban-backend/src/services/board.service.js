import { Board } from "../models/board.model.js";

export const createBoardService = async (data) => {
  return await Board.create(data);
};

export const getBoardsService = async () => {
  return await Board.find();
};