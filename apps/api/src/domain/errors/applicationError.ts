export class ApplicationError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = 500,
  ) {
    super(message);
    this.name = new.target.name;
  }
}

export class UnauthorizedError extends ApplicationError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

export class ForbiddenError extends ApplicationError {
  constructor(message = "Forbidden") {
    super(message, 403);
  }
}

export class NotFoundError extends ApplicationError {
  constructor(message = "Not found") {
    super(message, 404);
  }
}

export class ValidationError extends ApplicationError {
  constructor(message = "Validation error") {
    super(message, 400);
  }
}
