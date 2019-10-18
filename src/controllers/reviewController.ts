import fs from "fs";
import { Request, Response } from "express";

const reviews = JSON.parse(
  fs.readFileSync(
    `${__dirname}/../../dev-data/data/reviews.json`,
    encodeURI("")
  )
);

export const getAllReviews = (req: Request, res: Response) =>
  res.status(200).json({
    status: "success",
    results: reviews.length,
    data: { reviews }
  });

export const getReview = (req: Request, res: Response) => {
  const id: string = req.params.id;
  const review: object = reviews.find(
    (review: any): boolean => review._id === id
  );

  review
    ? res.status(200).json({
        status: "success",
        data: { review }
      })
    : res.status(404).json({
        status: "failure",
        message: "Invalid ID"
      });
};
