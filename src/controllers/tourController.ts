import fs from "fs";
import { NextFunction, Request, Response } from "express";

const tours = JSON.parse(
  fs.readFileSync(
    `${__dirname}/../../dev-data/data/tours-simple.json`,
    encodeURI("")
  )
);

// middlewares
export const checkTourID = (
  req: Request,
  res: Response,
  next: NextFunction,
  val: number
) => {
  console.log(`Tour id is ${val}`);

  Number(req.params.id) > tours.length
    ? res.status(404).json({
        status: "failure",
        message: "Invalid tour ID"
      })
    : next();
};

// controllers
export const getAllTours = (req: Request, res: Response) =>
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: { tours }
  });

export const getTour = (req: Request, res: Response) => {
  const id: number = Number(req.params.id);
  const tour: object = tours.find((tour: any) => tour.id === id);

  res.status(200).json({
    status: "success",
    data: { tour }
  });
};
