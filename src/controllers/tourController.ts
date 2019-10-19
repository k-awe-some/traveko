import fs from "fs";
import { Request, Response } from "express";
import Tour from "../models/tourModel";

// controllers
export const getAllTours = (req: Request, res: Response) =>
  res.status(200).json({
    status: "success"
  });

export const getTour = (req: Request, res: Response) => {
  res.status(200).json({
    status: "success"
  });
};
