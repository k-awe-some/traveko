import fs from "fs";
import { Request, Response } from "express";
import Tour from "../models/tourModel";

// GET requests
export const getAllTours = async (req: Request, res: Response) => {
  try {
    // excludes fields; builds query
    const queryObject = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach(el => delete queryObject[el]);
    const query = Tour.find(queryObject);

    // executes query
    const tours = await query;

    // sends response
    res.status(200).json({
      status: "success",
      results: tours.length,
      data: { tours }
    });
  } catch (error) {
    res.status(404).json({
      status: "failure",
      message: error
    });
  }
};

export const getTour = async (req: Request, res: Response) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: { tour }
    });
  } catch (error) {
    res.status(404).json({
      status: "failure",
      message: error
    });
  }
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

// PATCH requests
export const updateTour = async (req: Request, res: Response) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({
      status: "success",
      data: { tour }
    });
  } catch (error) {
    res.status(404).json({
      status: "failure",
      message: error
    });
  }
};

// DELETE requests
export const deleteTour = async (req: Request, res: Response) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null
    });
  } catch (error) {
    res.status(404).json({
      status: "failure",
      message: error
    });
  }
};
