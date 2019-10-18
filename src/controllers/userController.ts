import fs from "fs";
import { Request, Response } from "express";

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/../../dev-data/data/users.json`, encodeURI(""))
);

export const getAllUsers = (req: Request, res: Response) =>
  res.status(200).json({
    status: "success",
    results: users.length,
    data: { users }
  });

export const getUser = (req: Request, res: Response) => {
  const id: string = req.params.id;
  const user = users.find((user: any) => user._id === id);

  user
    ? res.status(200).json({
        status: "success",
        data: { user }
      })
    : res.status(404).json({
        status: "failure",
        message: "Invalid user ID"
      });
};
