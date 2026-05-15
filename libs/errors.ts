class UnauthorizedError extends Error {
  constructor() {
    super('Unauthorized');
    this.name = 'UnauthorizedError';
  }
}

class ForbiddenError extends Error {
  constructor() {
    super('Forbidden');
    this.name = 'ForbiddenError';
  }
}

class BadRequestError extends Error {
  constructor(message?: string) {
    super(message || 'Bad request');
    this.name = 'BadRequestError';
  }
}

class InternalServerError extends Error {
  constructor(message?: string) {
    super(message || 'Internal server error');
    this.name = 'InternalServerError';
  }
}

class PreconditionFailed extends Error {
  constructor(message?: string) {
    super(message || 'Precondition failed');
    this.name = 'PreconditionFailed';
  }
}

export { BadRequestError, ForbiddenError, InternalServerError, PreconditionFailed, UnauthorizedError };
