import fs from "fs";
import { Request, Response } from "express";

const tours = JSON.parse(
  fs.readFileSync(
    `${__dirname}/../../dev-data/data/tours-simple.json`,
    encodeURI("")
  )
);

export const getAllTours = (req: Request, res: Response) =>
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: { tours }
  });

export const getTour = (req: Request, res: Response) => {
  const id: number = Number(req.params.id);
  const tour: object = tours.find((tour: any) => tour.id === id);

  tour
    ? res.status(200).json({
        status: "success",
        data: { tour }
      })
    : res.status(404).json({
        status: "failure",
        message: "Invalid tour ID"
      });
};
