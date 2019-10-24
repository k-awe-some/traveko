import AppError from "../utils/AppError";

export interface Err extends AppError {
  status: string;
  message: string;
  name: string;
  path?: string;
  value?: string;
  code?: number;
  stack?: string;
  errmsg?: string;
  errors?: any[];
}
