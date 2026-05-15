class UnauthorizedError extends Error {
  constructor() {
    super('Unauthorized');
  }
}

class ForbiddenError extends Error {
  constructor() {
    super('Forbidden');
  }
}

class BadRequestError extends Error {
  constructor(message?: string) {
    super(message || 'Bad request');
  }
}

class InternalServerError extends Error {
  constructor(message?: string) {
    super(message || 'Internal server error');
  }
}

class PreconditionFailed extends Error {
  constructor(message?: string) {
    super(message || 'Precondition failed');
  }
}

export { BadRequestError, ForbiddenError, InternalServerError, PreconditionFailed, UnauthorizedError };
