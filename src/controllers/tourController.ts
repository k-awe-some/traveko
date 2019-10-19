import fs from "fs";
import { Request, Response } from "express";
import Tour from "../models/tourModel";

// GET requests
export const getAllTours = (req: Request, res: Response) =>
  res.status(200).json({
    status: "success"
  });

export const getTour = (req: Request, res: Response) => {
  res.status(200).json({
    status: "success"
  });
};

// POST requests
export const createTour = async (req: Request, res: Response) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: "success",
      data: { tour: newTour }
    });
  } catch (error) {
    res.status(400).json({
      status: "failure",
      message: error
    });
  }
};
