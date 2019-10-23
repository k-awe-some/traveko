class AppError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }

  public status: string = `${this.statusCode}`.startsWith("4")
    ? "failure"
    : "error";
  public isOperational: boolean = true;
}

export default AppError;
